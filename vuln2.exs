import Config

# Configure your database
#
# The MIX_TEST_PARTITION environment variable can be used
# to provide built-in test partitioning in CI environment.
# Run `mix help test` for more information.

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :console_api, ConsoleApiWeb.Endpoint,
  http: [ip: {127, 0, 0, 1}, port: 4002],
  secret_key_base: System.get_env("SECRET_KEY_BASE"),
  server: false

config :exvcr,
  vcr_cassette_library_dir: "test/support/tapes"

# In test we don't send emails.
config :console_api, ConsoleApi.Mailer, adapter: Swoosh.Adapters.Test

# Disable swoosh api client as it is only required for production adapters.
config :swoosh, :api_client, false

config :logger, backends: []

# Initialize plugs at runtime for faster test compilation
config :phoenix, :plug_init_mode, :runtime

config :console_api, :benefit_portal,
  base_urls: [
    zoe: "https://zoe.api.qa.swap.financial/api/v1",
    valuu: "https://valuu.api.qa.swap.financial/api/v1",
    solides: "https://solides.api.qa.swap.financial/api/v1",
    localiza: "https://localiza.api.qa.swap.financial/api/v1",
    facisc: "https://localiza.api.qa.swap.financial/api/v1",
    swapqa_teste: "https://webhook.site/1aa2667a-5093-4ab0-a00e-971c43f3bb64123123"
  ]

config :console_api, :reports,
  bucket_region: "us-east-1",
  bucket_sufix: "development"

config :schumi_ex, app_env: "test"

config :console_api, statement_url: "https://statement.test.swapcards.com.br"