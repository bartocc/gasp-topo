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

# Recipes
#########