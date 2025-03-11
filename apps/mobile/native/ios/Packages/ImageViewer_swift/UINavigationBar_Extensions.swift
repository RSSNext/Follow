import UIKit

extension UINavigationBar {
    
    func insert(to view: UIView) {
        view.addSubview(self)
        translatesAutoresizingMaskIntoConstraints = false
        leftAnchor.constraint(equalTo: view.leftAnchor).isActive = true
        rightAnchor.constraint(equalTo: view.rightAnchor).isActive = true
        
        if #available(iOS 11.0, *) {
            topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor)
                .isActive = true
        } else {
            topAnchor.constraint(equalTo: view.topAnchor)
                .isActive = true
        }
    }
}
