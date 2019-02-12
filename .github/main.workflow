workflow "Publish on release" {
  resolves = [
    "Publish to npm registry",
  ]
  on = "push"
}

workflow "Test on push for continuous integration" {
  resolves = [
    "npm run ci",
  ]
  on = "push"
}

action "Publish to npm registry" {
  uses = "actions/npm@4633da3702a5366129dca9d8cc3191476fc3433c"
  needs = [
    "npm run prerelease",
  ]
  args = "publish --access public"
  secrets = ["NPM_AUTH_TOKEN"]
}

action "npm run ci" {
  uses = "actions/npm@4633da3702a5366129dca9d8cc3191476fc3433c"
  args = "ci"
    needs = ["OnMaster"]
}

action "npm run prerelease" {
  uses = "actions/npm@4633da3702a5366129dca9d8cc3191476fc3433c"
  args = "ci"
  needs = ["OnTag"]
}

action "OnTag" {
  uses = "actions/bin/filter@ec328c7554cbb19d9277fc671cf01ec7c661cd9a"
  args = "tag v*"
}

action "OnMaster" {
  uses = "actions/bin/filter@ec328c7554cbb19d9277fc671cf01ec7c661cd9a"
  args = "branch master"
}
