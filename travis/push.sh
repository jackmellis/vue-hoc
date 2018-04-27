#!/bin/sh

setup_git() {
  git config --global user.email "travis@travis-ci.org"
  git config --global user.name "Travis CI"
}

commit_changelogs() {
  git add **/CHANGELOG.md
  git commit --message "Travis build: $TRAVIS_BUILD_NUMBER"
}

upload_files() {
  git remote add origin-master https://${GH_TOKEN}@github.com/jackmellis/vue-hoc.git > /dev/null 2>&1
  git push --quiet --set-upstream origin-master master
  git push --quiet --set-upstream origin-master master --tags
}

setup_git
commit_changelogs
upload_files
