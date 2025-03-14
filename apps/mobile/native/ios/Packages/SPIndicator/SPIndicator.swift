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

@available(iOSApplicationExtension, unavailable)
public enum SPIndicator {

    /**
     SPIndicator: Present alert with preset and custom haptic.

     - parameter title: Title text in alert.
     - parameter message: Subtitle text in alert. Optional.
     - parameter preset: Icon ready-use style or custom image.
     - parameter haptic: Haptic response with present. Default is `.success`.
     - parameter presentSide: Choose from side appear indicator.
     - parameter completion: Will call with dismiss alert.
     */
    public static func present(
        title: String, message: String? = nil, preset: SPIndicatorIconPreset,
        haptic: SPIndicatorHaptic, from presentSide: SPIndicatorPresentSide = .top,
        completion: (() -> Void)? = nil
    ) {
        let alertView = SPIndicatorView(title: title, message: message, preset: preset)
        alertView.presentSide = presentSide
        alertView.present(haptic: haptic, completion: completion)
    }

    /**
     SPIndicator: Present alert with preset and automatically detect type haptic.

     - parameter title: Title text in alert.
     - parameter message: Subtitle text in alert. Optional.
     - parameter preset: Icon ready-use style or custom image.
     - parameter presentSide: Choose from side appear indicator. Default is `.top`.
     - parameter completion: Will call with dismiss alert.
     */
    public static func present(
        title: String, message: String? = nil, preset: SPIndicatorIconPreset,
        from presentSide: SPIndicatorPresentSide = .top, completion: (() -> Void)? = nil
    ) {
        let alertView = SPIndicatorView(title: title, message: message, preset: preset)
        alertView.presentSide = presentSide
        let haptic = preset.getHaptic()
        alertView.present(haptic: haptic, completion: completion)
    }

    /**
     SPIndicator: Show only message, without title and icon.

     - parameter message: Title text.
     - parameter haptic: Haptic response with present. Default is `.success`.
     - parameter presentSide: Choose from side appear indicator. Default is `.top`.
     - parameter completion: Will call with dismiss alert.
     */
    public static func present(
        title: String, message: String? = nil, haptic: SPIndicatorHaptic,
        from presentSide: SPIndicatorPresentSide = .top, completion: (() -> Void)? = nil
    ) {
        let alertView = SPIndicatorView(title: title, message: message)
        alertView.presentSide = presentSide
        alertView.present(haptic: haptic, completion: completion)
    }

}
