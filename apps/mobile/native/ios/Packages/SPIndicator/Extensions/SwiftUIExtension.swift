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

import SwiftUI

@available(iOSApplicationExtension, unavailable)

extension View {

    public func SPIndicator(
        isPresent: Binding<Bool>,
        indicatorView: SPIndicatorView,
        duration: TimeInterval = 2.0,
        haptic: SPIndicatorHaptic = .none
    ) -> some View {

        if isPresent.wrappedValue {
            let indicatorCompletion = indicatorView.completion
            let indicatorDismiss = {
                isPresent.wrappedValue = false
                indicatorCompletion?()
            }
            indicatorView.duration = duration
            indicatorView.present(haptic: haptic, completion: indicatorDismiss)
        }
        return self
    }

    public func SPIndicator(
        isPresent: Binding<Bool>,
        title: String = "",
        message: String? = nil,
        duration: TimeInterval = 2.0,
        presentSide: SPIndicatorPresentSide = .top,
        dismissByDrag: Bool = true,
        preset: SPIndicatorIconPreset = .done,
        haptic: SPIndicatorHaptic = .none,
        layout: SPIndicatorLayout? = nil,
        completion: (() -> Void)? = nil
    ) -> some View {

        let indicatorView = SPIndicatorView(title: title, message: message, preset: preset)
        indicatorView.presentSide = presentSide
        indicatorView.dismissByDrag = dismissByDrag
        indicatorView.layout = layout ?? SPIndicatorLayout(for: preset)
        indicatorView.completion = completion
        return SPIndicator(
            isPresent: isPresent, indicatorView: indicatorView, duration: duration, haptic: haptic)
    }

    public func SPIndicator(
        isPresent: Binding<Bool>,
        title: String,
        duration: TimeInterval = 2.0,
        presentSide: SPIndicatorPresentSide = .top,
        dismissByDrag: Bool = true,
        preset: SPIndicatorIconPreset = .done,
        haptic: SPIndicatorHaptic = .none,
        completion: (() -> Void)? = nil
    ) -> some View {

        let indicatorView = SPIndicatorView(title: title, preset: preset)
        indicatorView.presentSide = presentSide
        indicatorView.dismissByDrag = dismissByDrag
        indicatorView.completion = completion
        return SPIndicator(
            isPresent: isPresent, indicatorView: indicatorView, duration: duration, haptic: haptic)
    }

}
