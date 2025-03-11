import UIKit

public enum ImageViewerOption {

    case contentMode(UIView.ContentMode)
    case closeIcon(UIImage)
    case rightNavItemTitle(String, onTap: ((Int) -> Void)?)
    case rightNavItemIcon(UIImage, onTap: ((Int) -> Void)?)
    case onPreview((Int) -> Void)
    case onClosePreview(() -> Void)
    case onIndexChange((Int) -> Void)
}
