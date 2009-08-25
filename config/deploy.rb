# External ressources
#####################

default_run_options[:pty] = true

# Capistrano multistages
set :stages, %w(ppd production)
require 'capistrano/ext/multistage'

# Config
########

set :application, "gasp-topo"

set :scm, :git
set :scm_command, "/opt/local/bin/git"
set :local_scm_command, "git"
set :repository, "git@github.com:cruxandco/gasp-topo.git"
set :branch, "master"

set :user, "deploy"
set :deploy_to do "/Users/deploy/apps/#{application}" end
set :deploy_via, :remote_cache
set :use_sudo, false

set :rake, "/opt/ruby-enterprise-1.8.6-20090610/bin/rake"

role :app, "yaniro.cruxandco.com"
role :web, "yaniro.cruxandco.com"
role :db,  "yaniro.cruxandco.com", :primary => true

ssh_options[:forward_agent] = true

# Callbacks
###########

after "deploy:setup", "deploy:shared_dirs", "deploy:database_config"
before "deploy:symlink", "deploy:symlink_database_conf"

# Recipes
#########

namespace :deploy do

  desc "Restarts your application."
  task :restart do
    run "touch #{current_path}/tmp/restart.txt"
  end
  
  desc "Creates the shared directories for the application"
  task :shared_dirs do
    run "mkdir -p #{deploy_to}/#{shared_dir}/config"
  end
  
  desc "Creates database.yml in shared/config"
  task :database_config do
    put database_configuration, "#{deploy_to}/#{shared_dir}/config/database.yml"
  end
  
  desc "Symlinks the shared directories for the new 'release_path'"
  task :symlink_database_conf do
    run "ln -nfs #{deploy_to}/#{shared_dir}/config/database.yml #{release_path}/config/database.yml" 
  end

end