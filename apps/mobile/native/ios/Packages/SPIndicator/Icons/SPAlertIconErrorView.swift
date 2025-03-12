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

public class SPIndicatorIconErrorView: UIView, SPIndicatorIconAnimatable {

    public func animate() {
        animateTopToBottomLine()
        animateBottomToTopLine()
    }
        
    private func animateTopToBottomLine() {
        let length = frame.width
        
        let topToBottomLine = UIBezierPath()
        topToBottomLine.move(to: CGPoint(x: length * 0, y: length * 0))
        topToBottomLine.addLine(to: CGPoint(x: length * 1, y: length * 1))
        
        let animatableLayer = CAShapeLayer()
        animatableLayer.path = topToBottomLine.cgPath
        animatableLayer.fillColor = UIColor.clear.cgColor
        animatableLayer.strokeColor = tintColor?.cgColor
        animatableLayer.lineWidth = 4
        animatableLayer.lineCap = .round
        animatableLayer.lineJoin = .round
        animatableLayer.strokeEnd = 0
        self.layer.addSublayer(animatableLayer)
        
        let animation = CABasicAnimation(keyPath: "strokeEnd")
        animation.duration = 0.22
        animation.fromValue = 0
        animation.toValue = 1
        animation.timingFunction = CAMediaTimingFunction(name: .easeInEaseOut)
        
        animatableLayer.strokeEnd = 1
        animatableLayer.add(animation, forKey: "animation")
    }
        
    private func animateBottomToTopLine() {
        let length = frame.width
        
        let bottomToTopLine = UIBezierPath()
        bottomToTopLine.move(to: CGPoint(x: length * 0, y: length * 1))
        bottomToTopLine.addLine(to: CGPoint(x: length * 1, y: length * 0))
        
        let animatableLayer = CAShapeLayer()
        animatableLayer.path = bottomToTopLine.cgPath
        animatableLayer.fillColor = UIColor.clear.cgColor
        animatableLayer.strokeColor = tintColor?.cgColor
        animatableLayer.lineWidth = 4
        animatableLayer.lineCap = .round
        animatableLayer.lineJoin = .round
        animatableLayer.strokeEnd = 0
        self.layer.addSublayer(animatableLayer)
        
        let animation = CABasicAnimation(keyPath: "strokeEnd")
        animation.duration = 0.22
        animation.fromValue = 0
        animation.toValue = 1
        animation.timingFunction = CAMediaTimingFunction(name: .easeInEaseOut)
        
        animatableLayer.strokeEnd = 1
        animatableLayer.add(animation, forKey: "animation")
    }
}
