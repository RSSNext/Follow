import Foundation
#if canImport(SDWebImage)
import SDWebImage
#endif

public protocol ImageLoader {
    func loadImage(_ url: URL, placeholder: UIImage?, imageView: UIImageView, completion: @escaping (_ image: UIImage?) -> Void)
}

public struct URLSessionImageLoader: ImageLoader {
    public init() {}

    public func loadImage(_ url: URL, placeholder: UIImage?, imageView: UIImageView, completion: @escaping (UIImage?) -> Void) {
        if let placeholder = placeholder {
            imageView.image = placeholder
        }

        DispatchQueue.global(qos: .background).async {
            guard let data = try? Data(contentsOf: url), let image = UIImage(data: data) else {
                completion(nil)
                return
            }

            DispatchQueue.main.async {
                imageView.image = image
                completion(image)
            }
        }
    }
}

#if canImport(SDWebImage)
struct SDWebImageLoader: ImageLoader {
    func loadImage(_ url: URL, placeholder: UIImage?, imageView: UIImageView, completion: @escaping (UIImage?) -> Void) {
        imageView.sd_setImage(
            with: url,
            placeholderImage: placeholder,
            options: [],
            progress: nil) {(img, err, type, url) in
                DispatchQueue.main.async {
                    completion(img)
                }
        }
    }
}
#endif
