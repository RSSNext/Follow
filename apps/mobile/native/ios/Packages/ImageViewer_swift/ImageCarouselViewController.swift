import UIKit

public protocol ImageDataSource: AnyObject {
    func numberOfImages() -> Int
    func imageItem(at index: Int) -> ImageItem
}

public class ImageCarouselViewController: UIPageViewController,
    ImageViewerTransitionViewControllerConvertible,
    UIPageViewControllerDelegate
{

    unowned var initialSourceView: UIImageView?
    var sourceView: UIImageView? {
        guard let vc = viewControllers?.first as? ImageViewerController else {
            return nil
        }
        return initialIndex == vc.index ? initialSourceView : nil
    }

    var targetView: UIImageView? {
        guard let vc = viewControllers?.first as? ImageViewerController else {
            return nil
        }
        return vc.imageView
    }

    weak var imageDatasource: ImageDataSource?
    let imageLoader: ImageLoader

    var initialIndex = 0

    var imageContentMode: UIView.ContentMode = .scaleAspectFill
    var options: [ImageViewerOption] = []

    private var onRightNavBarTapped: ((Int) -> Void)?
    private var onPreview: ((Int) -> Void)?
    private var onClosePreview: (() -> Void)?
    private var onIndexChange: ((Int) -> Void)?

    private(set) lazy var navBar: UINavigationBar = {
        let _navBar = UINavigationBar(frame: .zero)
        _navBar.isTranslucent = true
        _navBar.setBackgroundImage(UIImage(), for: .default)
        _navBar.shadowImage = UIImage()
        return _navBar
    }()

    private(set) lazy var backgroundView: UIView? = {
        let _v = UIView()
        _v.backgroundColor = .black
        _v.alpha = 1.0
        return _v
    }()

    private(set) lazy var navItem = UINavigationItem()

    private(set) lazy var pageIndicator: UIPageControl = {
        let pageControl = UIPageControl()
        pageControl.translatesAutoresizingMaskIntoConstraints = false
        pageControl.currentPageIndicatorTintColor = .white
        pageControl.pageIndicatorTintColor = .gray
        pageControl.isUserInteractionEnabled = false
        return pageControl
    }()

    private let imageViewerPresentationDelegate: ImageViewerTransitionPresentationManager

    public init(
        sourceView: UIImageView,
        imageDataSource: ImageDataSource?,
        imageLoader: ImageLoader,
        options: [ImageViewerOption] = [],
        initialIndex: Int = 0
    ) {
        self.initialSourceView = sourceView
        self.initialIndex = initialIndex
        self.options = options
        self.imageDatasource = imageDataSource
        self.imageLoader = imageLoader
        let pageOptions = [UIPageViewController.OptionsKey.interPageSpacing: 20]

        var _imageContentMode = imageContentMode
        options.forEach {
            switch $0 {
            case .contentMode(let contentMode):
                _imageContentMode = contentMode
            default:
                break
            }
        }
        imageContentMode = _imageContentMode

        self.imageViewerPresentationDelegate = ImageViewerTransitionPresentationManager(
            imageContentMode: imageContentMode)
        super.init(
            transitionStyle: .scroll,
            navigationOrientation: .horizontal,
            options: pageOptions)
        self.view.overrideUserInterfaceStyle = .dark
        transitioningDelegate = imageViewerPresentationDelegate
        modalPresentationStyle = .custom
        modalPresentationCapturesStatusBarAppearance = true
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    private func addNavBar() {
        let closeBarButton = UIBarButtonItem(
            barButtonSystemItem: .close,

            target: self,
            action: #selector(dismiss(_:)))

        navItem.leftBarButtonItem = closeBarButton
        navBar.alpha = 0.0
        navBar.items = [navItem]
        navBar.insert(to: view)
    }

    private func addBackgroundView() {
        guard let backgroundView = backgroundView else { return }
        view.addSubview(backgroundView)
        backgroundView.bindFrameToSuperview()
        view.sendSubviewToBack(backgroundView)
    }

    private func addPageIndicator() {
        view.addSubview(pageIndicator)
        NSLayoutConstraint.activate([
            pageIndicator.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            pageIndicator.bottomAnchor.constraint(
                equalTo: view.safeAreaLayoutGuide.bottomAnchor, constant: -20),
        ])

        if let imageDatasource = imageDatasource {
            pageIndicator.numberOfPages = imageDatasource.numberOfImages()
            pageIndicator.currentPage = initialIndex
        }
    }

    public func setRightNavItem(item: UIBarButtonItem) {
        navItem.rightBarButtonItem = item
    }

    private func applyOptions() {

        options.forEach {
            switch $0 {

            case .contentMode(let contentMode):
                self.imageContentMode = contentMode
            case .onPreview(let callback):
                self.onPreview = callback
            case .onClosePreview(let callback):
                self.onClosePreview = callback
            case .onIndexChange(let callback):
                self.onIndexChange = callback
            }
        }
    }

    override public func viewDidLoad() {
        super.viewDidLoad()

        addBackgroundView()
        addNavBar()
        addPageIndicator()
        applyOptions()

        dataSource = self
        delegate = self

        if let imageDatasource = imageDatasource {
            let initialVC: ImageViewerController = .init(
                index: initialIndex,
                imageItem: imageDatasource.imageItem(at: initialIndex),
                imageLoader: imageLoader,
                sourceView: initialSourceView
            )
            setViewControllers([initialVC], direction: .forward, animated: true)
            onPreview?(initialIndex)
        }
    }

    override public func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        if let vc = viewControllers?.first as? ImageViewerController {
            onPreview?(vc.index)
        }
    }

    @objc
    private func dismiss(_ sender: UIBarButtonItem) {
        onClosePreview?()
        self.dismiss(animated: true, completion: nil)
    }

    deinit {
        initialSourceView?.alpha = 1.0
        onClosePreview?()
    }

    @objc
    func diTapRightNavBarItem(_ sender: UIBarButtonItem) {
        guard let onTap = onRightNavBarTapped,
            let _firstVC = viewControllers?.first as? ImageViewerController
        else { return }
        onTap(_firstVC.index)
    }

}

// MARK: - UIPageViewControllerDelegate
extension ImageCarouselViewController {
    public func pageViewController(
        _ pageViewController: UIPageViewController,
        didFinishAnimating finished: Bool,
        previousViewControllers: [UIViewController],
        transitionCompleted completed: Bool
    ) {
        if completed,
            let currentVC = pageViewController.viewControllers?.first as? ImageViewerController
        {
            pageIndicator.currentPage = currentVC.index
            onIndexChange?(currentVC.index)
        }
    }
}

extension ImageCarouselViewController: UIPageViewControllerDataSource {
    public func pageViewController(
        _ pageViewController: UIPageViewController,
        viewControllerBefore viewController: UIViewController
    ) -> UIViewController? {

        guard let vc = viewController as? ImageViewerController else { return nil }
        guard let imageDatasource = imageDatasource else { return nil }
        guard vc.index > 0 else { return nil }

        let newIndex = vc.index - 1
        return ImageViewerController.init(
            index: newIndex,
            imageItem: imageDatasource.imageItem(at: newIndex),
            imageLoader: vc.imageLoader
        )
    }

    public func pageViewController(
        _ pageViewController: UIPageViewController,
        viewControllerAfter viewController: UIViewController
    ) -> UIViewController? {

        guard let vc = viewController as? ImageViewerController else { return nil }
        guard let imageDatasource = imageDatasource else { return nil }
        guard vc.index <= (imageDatasource.numberOfImages() - 2) else { return nil }

        let newIndex = vc.index + 1
        return ImageViewerController.init(
            index: newIndex,
            imageItem: imageDatasource.imageItem(at: newIndex),
            imageLoader: vc.imageLoader)
    }
}
