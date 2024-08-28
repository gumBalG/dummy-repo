package com.processor.invoice;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.Arrays;
import java.util.Collection;
import java.util.Optional;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.liquibase.LiquibaseProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.core.env.Environment;
import org.springframework.transaction.annotation.Transactional;

import com.google.gson.Gson;
import com.processor.invoice.config.ApplicationProperties;
import com.processor.invoice.config.CRLFLogConverter;
import com.processor.invoice.config.Constants;
import com.processor.invoice.dto.JobProcessDTO;
import com.processor.invoice.dto.enumeration.ProcessStatus;
import com.processor.invoice.service.ProcessRunnerService;

import tech.jhipster.config.DefaultProfileUtil;
import tech.jhipster.config.JHipsterConstants;

@SpringBootApplication
@EnableConfigurationProperties({ LiquibaseProperties.class, ApplicationProperties.class })
public class InvoiceDailyProcessApp {

    private static final Logger log = LoggerFactory.getLogger(InvoiceDailyProcessApp.class);

    private final Environment env;
    
    private final ProcessRunnerService processRunnerService;

    public static JobProcessDTO jobProcessDTO = new JobProcessDTO();

    public InvoiceDailyProcessApp(Environment env, ProcessRunnerService processRunnerService) {
        this.env = env;
        this.processRunnerService = processRunnerService;
    }
    
    public void registration() {
        jobProcessDTO.setInstance(env.getProperty("HOSTNAME"));
        jobProcessDTO.setJobName(Constants.PROC_NAME);
        jobProcessDTO = this.processRunnerService.startJobProcess(jobProcessDTO);

        Gson g = new Gson();
        String jobProcessDTOS = g.toJson(jobProcessDTO);
        log.info("jobProcessDTOS : " + jobProcessDTOS);
        System.setProperty("jobProcessDTOS", jobProcessDTOS);
        log.info("jobProcessDTOS set! ");
    }

    @PreDestroy
    public void destroyApplication() {
        try {
        	 if(Arrays.stream(env.getActiveProfiles()).anyMatch(
                     env -> (env.equalsIgnoreCase("dev") || env.equalsIgnoreCase("prod")))){
	            jobProcessDTO.setStatus(ProcessStatus.SUCCESS);
	            this.processRunnerService.finalizeJobProcess(jobProcessDTO);
        	 }
        } catch (Exception e) {
            log.error(e.getMessage());
            e.printStackTrace();
        }
    }

    @PostConstruct
    @Transactional
    public void initApplication() {
        Collection<String> activeProfiles = Arrays.asList(env.getActiveProfiles());
        if (
            activeProfiles.contains(JHipsterConstants.SPRING_PROFILE_DEVELOPMENT) &&
            activeProfiles.contains(JHipsterConstants.SPRING_PROFILE_PRODUCTION)
        ) {
            log.error(
                "You have misconfigured your application! It should not run " + "with both the 'dev' and 'prod' profiles at the same time."
            );
        }
        if (
            activeProfiles.contains(JHipsterConstants.SPRING_PROFILE_DEVELOPMENT) &&
            activeProfiles.contains(JHipsterConstants.SPRING_PROFILE_CLOUD)
        ) {
            log.error(
                "You have misconfigured your application! It should not " + "run with both the 'dev' and 'cloud' profiles at the same time."
            );
        }
        if(Arrays.stream(env.getActiveProfiles()).anyMatch(
                env -> (env.equalsIgnoreCase("dev") || env.equalsIgnoreCase("prod")))){
                registration();
            }
    }

    /**
     * Main method, used to run the application.
     *
     * @param args the command line arguments.
     */
    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(InvoiceDailyProcessApp.class);
        DefaultProfileUtil.addDefaultProfile(app);
        Environment env = app.run(args).getEnvironment();
        logApplicationStartup(env);
    }

    private static void logApplicationStartup(Environment env) {
        String protocol = Optional.ofNullable(env.getProperty("server.ssl.key-store")).map(key -> "https").orElse("http");
        String serverPort = env.getProperty("server.port");
        String contextPath = Optional
            .ofNullable(env.getProperty("server.servlet.context-path"))
            .filter(StringUtils::isNotBlank)
            .orElse("/");
        String hostAddress = "localhost";
        try {
            hostAddress = InetAddress.getLocalHost().getHostAddress();
        } catch (UnknownHostException e) {
            log.warn("The host name could not be determined, using `localhost` as fallback");
        }
        log.info(
            CRLFLogConverter.CRLF_SAFE_MARKER,
            "\n----------------------------------------------------------\n\t" +
            "Application '{}' is running! Access URLs:\n\t" +
            "Local: \t\t{}://localhost:{}{}\n\t" +
            "External: \t{}://{}:{}{}\n\t" +
            "Profile(s): \t{}\n----------------------------------------------------------",
            env.getProperty("spring.application.name"),
            protocol,
            serverPort,
            contextPath,
            protocol,
            hostAddress,
            serverPort,
            contextPath,
            env.getActiveProfiles().length == 0 ? env.getDefaultProfiles() : env.getActiveProfiles()
        );
    }
}