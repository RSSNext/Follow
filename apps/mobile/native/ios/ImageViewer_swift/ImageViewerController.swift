import UIKit

class ImageViewerController:UIViewController,
UIGestureRecognizerDelegate {
    
    var imageView: UIImageView = UIImageView(frame: .zero)
    let imageLoader: ImageLoader
    
    var backgroundView:UIView? {
        guard let _parent = parent as? ImageCarouselViewController
            else { return nil}
        return _parent.backgroundView
    }
    
    var index:Int = 0
    var imageItem:ImageItem!

    var navBar:UINavigationBar? {
        guard let _parent = parent as? ImageCarouselViewController
            else { return nil}
        return _parent.navBar
    }
    
    // MARK: Layout Constraints
    private var top:NSLayoutConstraint!
    private var leading:NSLayoutConstraint!
    private var trailing:NSLayoutConstraint!
    private var bottom:NSLayoutConstraint!
    
    private var scrollView:UIScrollView!
    
    private var lastLocation:CGPoint = .zero
    private var isAnimating:Bool = false
    private var maxZoomScale:CGFloat = 1.0
    
    init(
        index: Int,
        imageItem:ImageItem,
        imageLoader: ImageLoader) {

        self.index = index
        self.imageItem = imageItem
        self.imageLoader = imageLoader
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    override func loadView() {
        let view = UIView()
    
        view.backgroundColor = .clear
        self.view = view
        
        scrollView = UIScrollView()
        scrollView.delegate = self
        scrollView.showsVerticalScrollIndicator = false
        
        if #available(iOS 11.0, *) {
            scrollView.contentInsetAdjustmentBehavior = .never
        } else {
            // Fallback on earlier versions
        }
        view.addSubview(scrollView)
        scrollView.bindFrameToSuperview()
        scrollView.backgroundColor = .clear
        scrollView.addSubview(imageView)
        
        imageView.translatesAutoresizingMaskIntoConstraints = false
        top = imageView.topAnchor.constraint(equalTo: scrollView.topAnchor)
        leading = imageView.leadingAnchor.constraint(equalTo: scrollView.leadingAnchor)
        trailing = scrollView.trailingAnchor.constraint(equalTo: imageView.trailingAnchor)
        bottom = scrollView.bottomAnchor.constraint(equalTo: imageView.bottomAnchor)
        
        top.isActive = true
        leading.isActive = true
        trailing.isActive = true
        bottom.isActive = true
        
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()

        switch imageItem {
        case .image(let img):
            imageView.image = img
            imageView.layoutIfNeeded()
        case .url(let url, let placeholder):
            imageLoader.loadImage(url, placeholder: placeholder, imageView: imageView) { (image) in
                DispatchQueue.main.async {[weak self] in
                    self?.layout()
                }
            }
        default:
            break
        }
        
        addGestureRecognizers()
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        self.navBar?.alpha = 1.0
    }
    
    override func viewDidDisappear(_ animated: Bool) {
        super.viewDidDisappear(animated)
        self.navBar?.alpha = 0.0
    }
    
    override func viewWillLayoutSubviews() {
        super.viewWillLayoutSubviews()
        layout()
    }
    
    private func layout() {
        updateConstraintsForSize(view.bounds.size)
        updateMinMaxZoomScaleForSize(view.bounds.size)
    }
    
    // MARK: Add Gesture Recognizers
    func addGestureRecognizers() {
        
        let panGesture = UIPanGestureRecognizer(
            target: self, action: #selector(didPan(_:)))
        panGesture.cancelsTouchesInView = false
        panGesture.delegate = self
        scrollView.addGestureRecognizer(panGesture)
        
        let pinchRecognizer = UITapGestureRecognizer(
            target: self, action: #selector(didPinch(_:)))
        pinchRecognizer.numberOfTapsRequired = 1
        pinchRecognizer.numberOfTouchesRequired = 2
        scrollView.addGestureRecognizer(pinchRecognizer)
        
        let singleTapGesture = UITapGestureRecognizer(
            target: self, action: #selector(didSingleTap(_:)))
        singleTapGesture.numberOfTapsRequired = 1
        singleTapGesture.numberOfTouchesRequired = 1
        scrollView.addGestureRecognizer(singleTapGesture)
        
        let doubleTapRecognizer = UITapGestureRecognizer(
            target: self, action: #selector(didDoubleTap(_:)))
        doubleTapRecognizer.numberOfTapsRequired = 2
        doubleTapRecognizer.numberOfTouchesRequired = 1
        scrollView.addGestureRecognizer(doubleTapRecognizer)
        
        singleTapGesture.require(toFail: doubleTapRecognizer)
    }
    
    @objc
    func didPan(_ gestureRecognizer: UIPanGestureRecognizer) {
        guard
            isAnimating == false,
            scrollView.zoomScale == scrollView.minimumZoomScale
            else { return }
        
        let container:UIView! = imageView
        if gestureRecognizer.state == .began {
            lastLocation = container.center
        }
        
        if gestureRecognizer.state != .cancelled {
            let translation: CGPoint = gestureRecognizer
                .translation(in: view)
            container.center = CGPoint(
                x: lastLocation.x + translation.x,
                y: lastLocation.y + translation.y)
        }
        
        let diffY = view.center.y - container.center.y
        backgroundView?.alpha = 1.0 - abs(diffY/view.center.y)
        if gestureRecognizer.state == .ended {
            if abs(diffY) > 60 {
                dismiss(animated: true)
            } else {
                executeCancelAnimation()
            }
        }
    }
    
    @objc
    func didPinch(_ recognizer: UITapGestureRecognizer) {
        var newZoomScale = scrollView.zoomScale / 1.5
        newZoomScale = max(newZoomScale, scrollView.minimumZoomScale)
        scrollView.setZoomScale(newZoomScale, animated: true)
    }
    
    @objc
    func didSingleTap(_ recognizer: UITapGestureRecognizer) {
        
        let currentNavAlpha = self.navBar?.alpha ?? 0.0
        UIView.animate(withDuration: 0.235) {
            self.navBar?.alpha = currentNavAlpha > 0.5 ? 0.0 : 1.0
        }
    }
    
    @objc
    func didDoubleTap(_ recognizer:UITapGestureRecognizer) {
        let pointInView = recognizer.location(in: imageView)
        zoomInOrOut(at: pointInView)
    }
    
    func gestureRecognizerShouldBegin(
        _ gestureRecognizer: UIGestureRecognizer) -> Bool {
        guard scrollView.zoomScale == scrollView.minimumZoomScale,
            let panGesture = gestureRecognizer as? UIPanGestureRecognizer
            else { return false }
        
        let velocity = panGesture.velocity(in: scrollView)
        return abs(velocity.y) > abs(velocity.x)
    }
    
    
}

// MARK: Adjusting the dimensions
extension ImageViewerController {
    
    func updateMinMaxZoomScaleForSize(_ size: CGSize) {
        
        let targetSize = imageView.bounds.size
        if targetSize.width == 0 || targetSize.height == 0 {
            return
        }
        
        let minScale = min(
            size.width/targetSize.width,
            size.height/targetSize.height)
        let maxScale = max(
            (size.width + 1.0) / targetSize.width,
            (size.height + 1.0) / targetSize.height)
        
        scrollView.minimumZoomScale = minScale
        scrollView.zoomScale = minScale
        maxZoomScale = maxScale
        scrollView.maximumZoomScale = maxZoomScale * 1.1
    }
    
    
    func zoomInOrOut(at point:CGPoint) {
        let newZoomScale = scrollView.zoomScale == scrollView.minimumZoomScale
            ? maxZoomScale : scrollView.minimumZoomScale
        let size = scrollView.bounds.size
        let w = size.width / newZoomScale
        let h = size.height / newZoomScale
        let x = point.x - (w * 0.5)
        let y = point.y - (h * 0.5)
        let rect = CGRect(x: x, y: y, width: w, height: h)
        scrollView.zoom(to: rect, animated: true)
    }
    
    func updateConstraintsForSize(_ size: CGSize) {
        let yOffset = max(0, (size.height - imageView.frame.height) / 2)
        top.constant = yOffset
        bottom.constant = yOffset
        
        let xOffset = max(0, (size.width - imageView.frame.width) / 2)
        leading.constant = xOffset
        trailing.constant = xOffset
        view.layoutIfNeeded()
    }
    
}

// MARK: Animation Related stuff
extension ImageViewerController {
    
    private func executeCancelAnimation() {
        self.isAnimating = true
        UIView.animate(
            withDuration: 0.237,
            animations: {
                self.imageView.center = self.view.center
                self.backgroundView?.alpha = 1.0
        }) {[weak self] _ in
            self?.isAnimating = false
        }
    }
}

extension ImageViewerController:UIScrollViewDelegate {
    
    func viewForZooming(in scrollView: UIScrollView) -> UIView? {
        return imageView
    }
    
    func scrollViewDidZoom(_ scrollView: UIScrollView) {
        updateConstraintsForSize(view.bounds.size)
    }
}

