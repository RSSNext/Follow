const { withAppDelegate } = require("@expo/config-plugins")
const { mergeContents } = require("@expo/config-plugins/build/utils/generateCode")

const withFollowAppDelegate = (config) => {
  return withAppDelegate(config, async (config) => {
    let newContents = config.modResults.contents

    newContents = mergeContents({
      src: newContents,
      anchor: "// You can add your custom initial props in the dictionary below.",
      newSrc: `
  [UIView appearanceWhenContainedInInstancesOfClasses:@[[UIAlertController class]]].tintColor =
      [UIColor colorWithRed:255.0/255.0
                     green:92.0/255.0
                      blue:0.0/255.0
                     alpha:1.0];
  self.window.tintColor = [UIColor colorWithRed:255.0/255.0
                                         green:92.0/255.0
                                          blue:0.0/255.0
                                         alpha:1.0];
`,
      offset: 3,
      tag: "custom tint color",
      comment: "  //",
    }).contents

    config.modResults.contents = newContents

    return config
  })
}

module.exports = withFollowAppDelegate
