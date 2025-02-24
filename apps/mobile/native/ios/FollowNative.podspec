require 'json'

package = JSON.parse(File.read(File.join(__dir__, '..', 'package.json')))

Pod::Spec.new do |s|
  s.name           = 'FollowNative'
  s.version        = package['version']
  s.summary        = package['description']
  s.description    = package['description']
  s.license        = package['license']
  s.author         = package['author']
  s.homepage       = package['homepage']
  s.platforms      = {
    :ios => '15.1',
    :tvos => '15.1'
  }
  s.swift_version  = '5.4'
  s.source         = { git: 'https://github.com/RSSNext/follow' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'
  s.dependency 'SnapKit', '~> 5.7.0'
  s.dependency 'SDWebImage', '~> 5.0'
  s.dependency 'SPIndicator', '~> 1.0.0'
  # Swift/Objective-C compatibility
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
  }

  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp,js}"
  
  s.resource_bundles = {
    'js' => ['SharedWebView/injected/**/*'],
    'FollowNative' => ['Media.xcassets'],
  }

end
