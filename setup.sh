#!/bin/bash

###
### G L O B A L S
###
SOURCE=~/.bashrc

###
### L O G G I N G
###
function log {
  echo -e "\033[1;32m--- $@ ---\033[0m"
}
function err {
  echo -e "\033[1;31m--- $@ ---\033[0m"
}

###
### U T I L S
###
function ensureExists {
  if [[ ! -e $1 ]]; then
    touch $1
  fi
}
function sourceIfExists {
  if [[ -e $1 ]]; then
    source $1
  fi
}
function addBash {
  ensureExists ~/.bashrc
  if ! grep -q "$@" ~/.bashrc; then
    echo "$@" >> ~/.bashrc 2>&1
  fi
}
function addPath {
  if [[ ! $(echo $PATH 2>&1) =~ $1 ]]; then
    addBash "export PATH=$1:\$PATH"
  fi
  sourceIfExists $SOURCE
}

###
### S E T U P
###
function setupBashProfile {
  SOURCE=~/.bash_profile
  ensureExists ~/.bash_profile
  if ! grep -q "source ~/.bashrc" ~/.bash_profile; then
    echo "if [ -f ~/.bashrc ]; then
  source ~/.bashrc
fi" >> ~/.bash_profile
  fi
  log "[SETUP] .bash_profile"
}
function setupHomebrew {
  BREW_VER=$(brew --version 2>&1)
  if [[ $BREW_VER =~ "command not found" ]]; then
    ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
  fi
  addPath /usr/local/bin
  BREW_DOC=$(brew doctor 2>&1)
  if [[ ! $BREW_DOC =~ "Your system is ready to brew." ]]; then
    if [[ $BREW_DOC =~ "Your Homebrew is outdated." ]]; then
      brew update  
    else
      err "Run \`brew doctor\` and fix your system before continuing."
      err "If it's a path related issue, consider modifying /etc/paths."
      exit 1
    fi
  fi
  log "[SETUP] Homebrew $BREW_VER"
}
function setupGit {
  # Git/Xcode/GCC
  GIT_VER=$(git --version 2>&1)
  if [[ ! $GIT_VER =~ "git version" ]]; then
    err "Download and install Xcode, then rerun this script."
    exit 1
  fi
  if [[ ! $(git config --get push.default 2>&1) =~ "simple" ]]; then
    git config --global push.default simple
  fi
  log "[SETUP] $GIT_VER"
}
function setupNode {
  # Node & npm
  brew install node
  addPath /usr/local/share/npm/bin
  NPM_VER=$(npm --version 2>&1)
  if [[ $NPM_VER =~ "command not found" ]]; then
    wget -qO- https://npmjs.org/install.sh | sh
  fi
  if [[ $(lessc --version 2>&1) =~ "command not found" ]]; then
    npm install -g less@1.5.1
    npm install -g bower
    npm install -g gulp
  fi
  log "[SETUP] Node $NPM_VER"
}
function setupSSH {
  if [[ ! -d ~/.ssh ]]; then
    pushd . > /dev/null
    cd ~
    ssh-keygen
    popd > /dev/null
  fi
  read -p "Make sure you have SSH keys added to Github (press enter to continue)"
}

SYSTEM=$(uname)
if [ $SYSTEM = "Darwin" ]; then
  ###
  ### M A C  O S
  ###
  setupBashProfile
  setupHomebrew
  setupGit
  setupNode
  setupSSH
fi

