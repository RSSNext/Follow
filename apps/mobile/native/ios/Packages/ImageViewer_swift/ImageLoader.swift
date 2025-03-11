import Foundation
import SDWebImage

public protocol ImageLoader {
    func loadImage(_ url: URL, placeholder: UIImage?, imageView: UIImageView, completion: @escaping (_ image: UIImage?) -> Void)
}
 
struct SDWebImageLoader: ImageLoader {
    func loadImage(_ url: URL, placeholder: UIImage?, imageView: UIImageView, completion: @escaping (UIImage?) -> Void) {
        guard var urlComponents = URLComponents(url: url, resolvingAgainstBaseURL: false) else { return }
        urlComponents.scheme = "https"
        guard let httpsURL = urlComponents.url else { return }
      
        imageView.sd_setImage(
            with: httpsURL,
            placeholderImage: placeholder,
            options: [],
            progress: nil) {(img, err, type, url) in
                DispatchQueue.main.async {
                    completion(img)
                }
              
              if let error = err {
                      print("Error: \(error.localizedDescription)")
                      if let nsError = error as NSError? {
                          print("Error Code: \(nsError.code), Domain: \(nsError.domain)")
                      }
              }
        }
    }
}
