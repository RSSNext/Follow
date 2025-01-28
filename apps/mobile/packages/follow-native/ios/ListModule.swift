import ExpoModulesCore

public class ListModule: Module {
  public func definition() -> ModuleDefinition {
    Name("FOListView")
    View(FOList.self)
  }
}
