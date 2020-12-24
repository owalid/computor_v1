OS="`uname`"
case $OS in
  'Linux')
    OS='Linux'
    apt-get -y install curl software-properties-common
    curl -sL https://deb.nodesource.com/setup_11.x | sudo bash -
    apt-get -y install nodejs
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
    sudo apt -y update
    sudo apt -y install yarn
    ;;
  'Darwin') 
    OS='Mac'
    if ! brew ls --versions yarn > /dev/null; then
    brew install yarn
    fi
    ;;
  *) ;;
esac
echo $OS
npm i -g vue-cli-service
npm run build
npx serve -s dist -l 4000
python -m webbrowser "http://localhost:4000/"