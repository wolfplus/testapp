#!/usr/bin/env ruby
require 'xcodeproj'

pathIonicProject = "/Applications/MAMP/htdocs/mai21/app-v3/ios/"
name = "App"
projectpath = "./ios/App/" + name + ".xcodeproj"
puts "Adding entitlement push to " + name
puts "Opening " + projectpath
proj = Xcodeproj::Project.open(projectpath)
entitlement_path = "App/App.entitlements"

group_name= proj.root_object.main_group.name

file = proj.new_file(entitlement_path)

attributes = {}
proj.targets.each do |target|
    attributes[target.uuid] = {"SystemCapabilities" => {"com.apple.Push" => {"enabled" => 1}}}
    target.add_file_references([file])
    puts "Added to target: " + target.uuid
end
proj.root_object.attributes['TargetAttributes'] = attributes

proj.build_configurations.each do |config|
    config.build_settings.store("CODE_SIGN_ENTITLEMENTS", entitlement_path)
end
puts "Added entitlements file path: " + entitlement_path

#proj.recreate_user_schemes
proj.save
