# External ressources
#####################

default_run_options[:pty] = true

# from gem josh-slicehost
require 'capistrano/ext/slicehost'

# Config
########

set :application, "gasp-topo"
set :repository, "git@github.com:cruxandco/gasp-topo.git"
set :scm, :git
set :branch, "master"

set :user, "deploy"
ssh_options[:port] = 3456

set :deploy_to do "/home/#{user}/apps/production/#{application}" end
set :deploy_via, :remote_cache
set :use_sudo, false

role :app, "cruxandco.com"
role :web, "cruxandco.com"
role :db,  "cruxandco.com", :primary => true

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
    database_configuration = {"production" =>
      {
        "adapter" => "mysql",
        "database" => "gasp-topo_production",
        "username" => "root",
        "password" => "mysql"
      }
    }
    put YAML.dump(database_configuration), "#{deploy_to}/#{shared_dir}/config/database.yml"
  end
  
  desc "Symlinks the shared directories for the new 'release_path'"
  task :symlink_database_conf do
    run "ln -nfs #{deploy_to}/#{shared_dir}/config/database.yml #{release_path}/config/database.yml" 
  end

end