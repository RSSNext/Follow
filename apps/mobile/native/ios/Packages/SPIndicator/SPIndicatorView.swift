// The MIT License (MIT)
// Copyright © 2021 Ivan Vorobei (hello@ivanvorobei.io)
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import UIKit

/// SPIndicator: Main view. Can be customisable if need.
///
/// For change duration, check method `present` and pass duration and other specific property if need customise.
///
/// Here available set window on which shoud be present.
/// If you have some windows, you shoud configure it. Check property `presentWindow`.
///
/// For disable dismiss by drag, check property `.dismissByDrag`.
///
/// Recomended call `SPIndicator` and choose style func.
@available(iOSApplicationExtension, unavailable)
open class SPIndicatorView: UIView {

    // MARK: - UIAppearance

    @objc dynamic open var duration: TimeInterval = 1.5

    // MARK: - Properties

    /**
     SPIndicator: Change it for set `top` or `bottom` present side.
     Shoud be change before present, instead of no effect.
     */
    open var presentSide: SPIndicatorPresentSide = .top

    /**
     SPIndicator: By default allow drag indicator for hide.
     While indicator is dragging, dismiss not work.
     This behaviar can be disabled.
     */
    open var dismissByDrag: Bool = true {
        didSet {
            setGesture()
        }
    }

    /**
     SPIndicator: Completion call after hide indicator.
     */
    open var completion: (() -> Void)? = nil

    // MARK: - Views

    open var titleLabel: UILabel?
    open var subtitleLabel: UILabel?
    open var iconView: UIView?

    private lazy var backgroundView: UIVisualEffectView = {
        let view: UIVisualEffectView = {
            if #available(iOS 13.0, *) {
                return UIVisualEffectView(effect: UIBlurEffect(style: .systemThickMaterial))
            } else {
                return UIVisualEffectView(effect: UIBlurEffect(style: .light))
            }
        }()
        view.isUserInteractionEnabled = false
        return view
    }()

    weak open var presentWindow: UIWindow?

    // MARK: - Init

    public init(title: String, message: String? = nil, preset: SPIndicatorIconPreset) {
        super.init(frame: CGRect.zero)
        commonInit()
        layout = SPIndicatorLayout(for: preset)
        setTitle(title)
        if let message = message {
            setMessage(message)
        }
        setIcon(for: preset)
    }

    public init(title: String, message: String?) {
        super.init(frame: CGRect.zero)
        titleAreaFactor = 1.8
        minimumAreaWidth = 100
        commonInit()
        layout = SPIndicatorLayout.message()
        setTitle(title)
        if let message = message {
            setMessage(message)
        }
    }

    public required init?(coder aDecoder: NSCoder) {
        self.presentSide = .top
        super.init(coder: aDecoder)
        commonInit()
    }

    private func commonInit() {
        preservesSuperviewLayoutMargins = false
        insetsLayoutMarginsFromSafeArea = false

        backgroundColor = .clear
        backgroundView.layer.masksToBounds = true
        addSubview(backgroundView)

        setShadow()
        setGesture()
    }

    // MARK: - Configure

    private func setTitle(_ text: String) {
        let label = UILabel()
        label.font = UIFont.preferredFont(
            forTextStyle: .footnote, weight: .semibold, addPoints: 0)
        label.numberOfLines = 1
        let style = NSMutableParagraphStyle()
        style.lineBreakMode = .byTruncatingTail
        style.lineSpacing = 3
        label.attributedText = NSAttributedString(
            string: text, attributes: [.paragraphStyle: style]
        )
        label.textAlignment = .center
        label.textColor = UIColor.Compability.label
        titleLabel = label
        addSubview(label)
    }

    private func setMessage(_ text: String) {
        let label = UILabel()
        label.font = UIFont.preferredFont(
            forTextStyle: .footnote, weight: .semibold, addPoints: 0)
        label.numberOfLines = 0
        let style = NSMutableParagraphStyle()
        style.lineBreakMode = .byTruncatingTail
        style.lineSpacing = 2
        label.attributedText = NSAttributedString(
            string: text, attributes: [.paragraphStyle: style]
        )
        label.textAlignment = .center
        label.textColor = UIColor.Compability.label.withAlphaComponent(0.8)
        subtitleLabel = label
        addSubview(label)
    }

    private func setIcon(for preset: SPIndicatorIconPreset) {
        let view = preset.createView()
        self.iconView = view
        addSubview(view)
    }

    private func setShadow() {
        layer.shadowColor = UIColor.black.cgColor
        layer.shadowOpacity = 0.22
        layer.shadowOffset = .init(width: 0, height: 7)
        layer.shadowRadius = 40

        // Not use render shadow becouse backgorund is visual effect.
        // If turn on it, background will hide.
        // layer.shouldRasterize = true
    }

    private func setGesture() {
        if dismissByDrag {
            let gestureRecognizer = UIPanGestureRecognizer(
                target: self, action: #selector(handlePan))
            addGestureRecognizer(gestureRecognizer)
            self.gestureRecognizer = gestureRecognizer
        } else {
            self.gestureRecognizer = nil
        }
    }

    // MARK: - Present

    private var presentAndDismissDuration: TimeInterval = 0.6

    private var presentWithOpacity: Bool {
        if presentSide == .center { return true }
        return false
    }

    open func present(haptic: SPIndicatorHaptic = .success, completion: (() -> Void)? = nil) {
        present(duration: self.duration, haptic: haptic, completion: completion)
    }

    open func present(
        duration: TimeInterval, haptic: SPIndicatorHaptic = .success,
        completion: (() -> Void)? = nil
    ) {

        if self.presentWindow == nil {
            self.presentWindow = UIApplication.shared.keyWindow
        }

        guard let window = self.presentWindow else { return }

        window.addSubview(self)

        // Prepare for present

        self.whenGestureEndShoudHide = false
        self.completion = completion

        isHidden = true
        sizeToFit()
        layoutSubviews()
        center.x = window.frame.midX
        toPresentPosition(.prepare(presentSide))

        self.alpha = presentWithOpacity ? 0 : 1

        // Present

        isHidden = false
        haptic.impact()
        UIView.animate(
            withDuration: presentAndDismissDuration, delay: 0, usingSpringWithDamping: 1,
            initialSpringVelocity: 0, options: [.beginFromCurrentState, .curveEaseOut],
            animations: {
                self.toPresentPosition(.visible(self.presentSide))
                if self.presentWithOpacity { self.alpha = 1 }
            },
            completion: { finished in
                DispatchQueue.main.asyncAfter(deadline: DispatchTime.now() + duration) {
                    if self.gestureIsDragging {
                        self.whenGestureEndShoudHide = true
                    } else {
                        self.dismiss()
                    }
                }
            })

        if let iconView = self.iconView as? SPIndicatorIconAnimatable {
            DispatchQueue.main.asyncAfter(
                deadline: DispatchTime.now() + presentAndDismissDuration / 3
            ) {
                iconView.animate()
            }
        }
    }

    @objc open func dismiss() {
        UIView.animate(
            withDuration: presentAndDismissDuration, delay: 0, usingSpringWithDamping: 1,
            initialSpringVelocity: 0, options: [.beginFromCurrentState, .curveEaseIn],
            animations: {
                self.toPresentPosition(.prepare(self.presentSide))
                if self.presentWithOpacity { self.alpha = 0 }
            },
            completion: { finished in
                self.removeFromSuperview()
                self.completion?()
            })
    }

    // MARK: - Internal

    private var minimumYTranslationForHideByGesture: CGFloat = -10
    private var maximumYTranslationByGesture: CGFloat = 60

    private var gestureRecognizer: UIPanGestureRecognizer?
    private var gestureIsDragging: Bool = false
    private var whenGestureEndShoudHide: Bool = false

    @objc func handlePan(_ gestureRecognizer: UIPanGestureRecognizer) {

        if gestureRecognizer.state == .began || gestureRecognizer.state == .changed {
            self.gestureIsDragging = true
            let translation = gestureRecognizer.translation(in: self)
            let newTranslation: CGFloat = {
                switch presentSide {
                case .top:
                    if translation.y <= 0 {
                        return translation.y
                    } else {
                        return min(maximumYTranslationByGesture, translation.y.squareRoot())
                    }
                case .bottom:
                    if translation.y >= 0 {
                        return translation.y
                    } else {
                        let absolute = abs(translation.y)
                        return -min(maximumYTranslationByGesture, absolute.squareRoot())
                    }
                case .center:
                    let absolute = abs(translation.y).squareRoot()
                    let newValue = translation.y < 0 ? -absolute : absolute
                    return min(maximumYTranslationByGesture, newValue)
                }
            }()
            toPresentPosition(.fromVisible(newTranslation, from: (presentSide)))
        }

        if gestureRecognizer.state == .ended {
            gestureIsDragging = false

            var shoudDismissWhenEndAnimation: Bool = false

            UIView.animate(
                withDuration: presentAndDismissDuration, delay: 0, usingSpringWithDamping: 1,
                initialSpringVelocity: 0, options: [.beginFromCurrentState, .curveEaseIn],
                animations: {
                    if self.whenGestureEndShoudHide {
                        self.toPresentPosition(.prepare(self.presentSide))
                        shoudDismissWhenEndAnimation = true
                    } else {
                        let translation = gestureRecognizer.translation(in: self)
                        if translation.y < self.minimumYTranslationForHideByGesture {
                            self.toPresentPosition(.prepare(self.presentSide))
                            shoudDismissWhenEndAnimation = true
                        } else {
                            self.toPresentPosition(.visible(self.presentSide))
                        }
                    }
                },
                completion: { _ in
                    if shoudDismissWhenEndAnimation {
                        self.dismiss()
                    }
                })
        }
    }

    private func toPresentPosition(_ position: PresentPosition) {

        let getPrepareTransform: ((_ side: SPIndicatorPresentSide) -> CGAffineTransform) = {
            [weak self] side in
            guard let self = self else { return .identity }
            guard let window = UIApplication.shared.windows.first else { return .identity }
            switch side {
            case .top:
                let topInset = window.safeAreaInsets.top
                let position = -(topInset + 50)
                return CGAffineTransform.identity.translatedBy(x: 0, y: position)
            case .bottom:
                let height = window.frame.height
                let bottomInset = window.safeAreaInsets.bottom
                let position = height + bottomInset + 50
                return CGAffineTransform.identity.translatedBy(x: 0, y: position)
            case .center:
                return CGAffineTransform.identity.translatedBy(
                    x: 0, y: window.frame.height / 2 - self.frame.height / 2
                ).scaledBy(x: 0.9, y: 0.9)
            }
        }

        let getVisibleTransform: ((_ side: SPIndicatorPresentSide) -> CGAffineTransform) = {
            [weak self] side in
            guard let self = self else { return .identity }
            guard let window = UIApplication.shared.windows.first else { return .identity }
            switch side {
            case .top:
                var topSafeAreaInsets = window.safeAreaInsets.top
                if topSafeAreaInsets < 20 { topSafeAreaInsets = 20 }
                let position = topSafeAreaInsets - 3 + self.offset
                return CGAffineTransform.identity.translatedBy(x: 0, y: position)
            case .bottom:
                let height = window.frame.height
                var bottomSafeAreaInsets = window.safeAreaInsets.top
                if bottomSafeAreaInsets < 20 { bottomSafeAreaInsets = 20 }
                let position =
                    height - bottomSafeAreaInsets - 3 - self.frame.height - self.offset
                return CGAffineTransform.identity.translatedBy(x: 0, y: position)
            case .center:
                return CGAffineTransform.identity.translatedBy(
                    x: 0, y: window.frame.height / 2 - self.frame.height / 2)
            }
        }

        switch position {
        case .prepare(let presentSide):
            transform = getPrepareTransform(presentSide)
        case .visible(let presentSide):
            transform = getVisibleTransform(presentSide)
        case .fromVisible(let translation, let presentSide):
            transform = getVisibleTransform(presentSide).translatedBy(x: 0, y: translation)
        }
    }

    // MARK: - Layout

    /**
     SPIndicator: Wraper of layout values.
     */
    open var layout: SPIndicatorLayout = .init()

    /**
     SPIndicator: Alert offset
     */
    open var offset: CGFloat = 0

    private var minimumAreaHeight: CGFloat = 50
    private var minimumAreaWidth: CGFloat = 196
    private var maximumAreaWidth: CGFloat = 260
    private var titleAreaFactor: CGFloat = 2.5
    private var spaceBetweenTitles: CGFloat = 1
    private var spaceBetweenTitlesAndImage: CGFloat = 16

    private var titlesCompactWidth: CGFloat {
        if let iconView = self.iconView {
            let space = iconView.frame.maxY + spaceBetweenTitlesAndImage
            return frame.width - space * 2
        } else {
            return frame.width - layoutMargins.left - layoutMargins.right
        }
    }

    private var titlesFullWidth: CGFloat {
        if let iconView = self.iconView {
            let space = iconView.frame.maxY + spaceBetweenTitlesAndImage
            return frame.width - space - layoutMargins.right - self.spaceBetweenTitlesAndImage
        } else {
            return frame.width - layoutMargins.left - layoutMargins.right
        }
    }

    open override func sizeThatFits(_ size: CGSize) -> CGSize {
        var width = minimumAreaWidth

        // First determine the width we'll use
        titleLabel?.sizeToFit()
        let titleWidth: CGFloat = titleLabel?.frame.width ?? 0

        subtitleLabel?.sizeToFit()
        let subtitleWidth: CGFloat = subtitleLabel?.frame.width ?? 0

        width = (max(titleWidth, subtitleWidth) * titleAreaFactor).rounded()

        if width < minimumAreaWidth { width = minimumAreaWidth }
        if width > maximumAreaWidth { width = maximumAreaWidth }

        // Now calculate heights based on this width
        let availableTextWidth = width - layoutMargins.left - layoutMargins.right

        var titleHeight: CGFloat = 0
        if let titleLabel = titleLabel {
            titleLabel.frame.size.width = availableTextWidth
            titleLabel.sizeToFit()
            titleHeight = titleLabel.frame.height
        }

        var subtitleHeight: CGFloat = 0
        if let subtitleLabel = subtitleLabel {
            subtitleLabel.frame.size.width = availableTextWidth
            subtitleLabel.sizeToFit()
            subtitleHeight = subtitleLabel.frame.height
        }

        // Calculate dynamic height based on content
        var height: CGFloat = 0
        if titleLabel != nil && subtitleLabel != nil {
            height =
                titleHeight + subtitleHeight + spaceBetweenTitles + layoutMargins.top
                + layoutMargins.bottom
        } else if titleLabel != nil {
            height = titleHeight + layoutMargins.top + layoutMargins.bottom
        } else if subtitleLabel != nil {
            height = subtitleHeight + layoutMargins.top + layoutMargins.bottom
        }

        // Ensure minimum height
        if height < minimumAreaHeight {
            height = minimumAreaHeight
        }

        return .init(width: width, height: height)
    }

    open override func layoutSubviews() {
        super.layoutSubviews()

        layoutMargins = layout.margins
        layer.cornerRadius = frame.height / 2
        backgroundView.frame = bounds
        backgroundView.layer.cornerRadius = layer.cornerRadius

        // Flags

        let hasIcon = (self.iconView != nil)
        let hasTitle = (self.titleLabel != nil)
        let hasSubtite = (self.subtitleLabel != nil)

        let fitTitleToCompact: Bool = {
            guard let titleLabel = self.titleLabel else { return true }
            titleLabel.numberOfLines = 1
            titleLabel.sizeToFit()
            return titleLabel.frame.width < titlesCompactWidth
        }()

        let fitSubtitleToCompact: Bool = {
            guard let subtitleLabel = self.subtitleLabel else { return true }
            let originalLines = subtitleLabel.numberOfLines
            subtitleLabel.sizeToFit()
            subtitleLabel.numberOfLines = originalLines
            return subtitleLabel.frame.width < titlesCompactWidth
        }()

        let notFitAnyLabelToCompact: Bool = {
            if !fitTitleToCompact { return true }
            if !fitSubtitleToCompact { return true }
            return false
        }()

        var layout: LayoutGrid = .iconTitleCentered

        if (hasIcon && hasTitle && hasSubtite) && !notFitAnyLabelToCompact {
            layout = .iconTitleMessageCentered
        }

        if (hasIcon && hasTitle && hasSubtite) && notFitAnyLabelToCompact {
            layout = .iconTitleMessageLeading
        }

        if hasIcon && hasTitle && !hasSubtite {
            layout = .iconTitleCentered
        }

        if !hasIcon && hasTitle && !hasSubtite {
            layout = .title
        }

        if !hasIcon && hasTitle && hasSubtite {
            layout = .titleMessage
        }

        // Actions

        let layoutIcon = { [weak self] in
            guard let self = self else { return }
            guard let iconView = self.iconView else { return }
            iconView.frame = .init(
                origin: .init(x: self.layoutMargins.left, y: iconView.frame.origin.y),
                size: self.layout.iconSize
            )
            iconView.center.y = self.bounds.midY
        }

        let layoutTitleCenteredCompact = { [weak self] in
            guard let self = self else { return }
            guard let titleLabel = self.titleLabel else { return }
            titleLabel.textAlignment = .center
            titleLabel.layoutDynamicHeight(width: self.titlesCompactWidth)
            titleLabel.center.x = self.frame.width / 2
        }

        let layoutTitleCenteredFullWidth = { [weak self] in
            guard let self = self else { return }
            guard let titleLabel = self.titleLabel else { return }
            titleLabel.textAlignment = .center
            titleLabel.layoutDynamicHeight(width: self.titlesFullWidth)
            titleLabel.center.x = self.frame.width / 2
        }

        let layoutTitleLeadingFullWidth = { [weak self] in
            guard let self = self else { return }
            guard let titleLabel = self.titleLabel else { return }
            guard let iconView = self.iconView else { return }
            let rtl = self.effectiveUserInterfaceLayoutDirection == .rightToLeft
            titleLabel.textAlignment = rtl ? .right : .left
            titleLabel.layoutDynamicHeight(width: self.titlesFullWidth)
            titleLabel.frame.origin.x =
                self.layoutMargins.left + iconView.frame.width + self.spaceBetweenTitlesAndImage
        }

        let layoutSubtitle = { [weak self] in
            guard let self = self else { return }
            guard let titleLabel = self.titleLabel else { return }
            guard let subtitleLabel = self.subtitleLabel else { return }
            subtitleLabel.textAlignment = titleLabel.textAlignment
            subtitleLabel.layoutDynamicHeight(width: titleLabel.frame.width)
            subtitleLabel.frame.origin.x = titleLabel.frame.origin.x
        }

        let layoutTitleSubtitleByVertical = { [weak self] in
            guard let self = self else { return }
            guard let titleLabel = self.titleLabel else { return }
            guard let subtitleLabel = self.subtitleLabel else {
                titleLabel.center.y = self.bounds.midY
                return
            }
            let allHeight =
                titleLabel.frame.height + subtitleLabel.frame.height + self.spaceBetweenTitles
            titleLabel.frame.origin.y = (self.frame.height - allHeight) / 2
            subtitleLabel.frame.origin.y = titleLabel.frame.maxY + self.spaceBetweenTitles
        }

        // Apply

        switch layout {
        case .iconTitleMessageCentered:
            layoutIcon()
            layoutTitleCenteredCompact()
            layoutSubtitle()
        case .iconTitleMessageLeading:
            layoutIcon()
            layoutTitleLeadingFullWidth()
            layoutSubtitle()
        case .iconTitleCentered:
            layoutIcon()
            titleLabel?.numberOfLines = 2
            layoutTitleCenteredCompact()
        case .iconTitleLeading:
            layoutIcon()
            titleLabel?.numberOfLines = 2
            layoutTitleLeadingFullWidth()
        case .title:
            titleLabel?.numberOfLines = 2
            layoutTitleCenteredFullWidth()
        case .titleMessage:
            layoutTitleCenteredFullWidth()
            layoutSubtitle()
        }

        layoutTitleSubtitleByVertical()
    }

    // MARK: - Models

    enum PresentPosition {

        case prepare(_ from: SPIndicatorPresentSide)
        case visible(_ from: SPIndicatorPresentSide)
        case fromVisible(_ translation: CGFloat, from: SPIndicatorPresentSide)
    }

    enum LayoutGrid {

        case iconTitleMessageCentered
        case iconTitleMessageLeading
        case iconTitleCentered
        case iconTitleLeading
        case title
        case titleMessage
    }
}
