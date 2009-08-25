set :rails_env, "production"

database_configuration =<<EOF

production:
  database: gasp-topo_production
  adapter: mysql
  username: gasp
  password: alpamayo
EOF

set :database_configuration, database_configuration