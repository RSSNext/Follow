import ExpoModulesCore
import SwiftUI

struct Item: Codable {
  let id: String
  let name: String
}
class FOListProps: ExpoSwiftUI.ViewProps {
  @Field var items: [Item]
}

struct FOList: ExpoSwiftUI.View {
  @EnvironmentObject var props: FOListProps
  
  var body: some View {
    Group {
      Text("test")
      Text("test")
      
      VStack {
        Rectangle().fill(Color.red).frame(width: 100, height: 100)
      }
      
      Text("test")
      List {
        Text("test")
  //      ForEach(props.items, id: \.id) { item in
  //        Text(item.name)
  //        Text(" GTest")
  //      }
      }
  //    Text("test").padding()
      
    }
   
  }
}
