//
//  TimelineCell.swift
//  FollowNative
//
//  Created by Innei on 2025/2/12.
//

import SDWebImage
import SnapKit
import UIKit

class TimelineCell: UITableViewCell {
  private let containerStackView: UIStackView = {
    let stack = UIStackView()
    stack.axis = .horizontal
    stack.alignment = .center
    stack.spacing = 8
    return stack
  }()

  private let contentStackView: UIStackView = {
    let stack = UIStackView()
    stack.axis = .vertical
    stack.spacing = 8
    return stack
  }()

  private let titleLabel: UILabel = {
    let label = UILabel()
    label.font = .systemFont(ofSize: 18, weight: .semibold)
    label.numberOfLines = 2
    return label
  }()

  private let descriptionLabel: UILabel = {
    let label = UILabel()
    label.font = .systemFont(ofSize: 14)
    label.textColor = .secondaryLabel
    label.numberOfLines = 2
    return label
  }()

  private let dateLabel: UILabel = {
    let label = UILabel()
    label.font = .systemFont(ofSize: 12)
    label.textColor = .tertiaryLabel
    return label
  }()

  private let thumbnailImageView: UIImageView = {
    let imageView = UIImageView()
    imageView.contentMode = .scaleAspectFill
    imageView.clipsToBounds = true
    imageView.layer.cornerRadius = 8
    imageView.backgroundColor = .systemFill
    return imageView
  }()

  override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
    super.init(style: style, reuseIdentifier: reuseIdentifier)

    setupUI()
  }

  private func setupUI() {
    contentView.addSubview(containerStackView)

    containerStackView.addArrangedSubview(contentStackView)
    containerStackView.addArrangedSubview(thumbnailImageView)

    contentStackView.addArrangedSubview(titleLabel)
    contentStackView.addArrangedSubview(descriptionLabel)
    contentStackView.addArrangedSubview(dateLabel)

    containerStackView.snp.makeConstraints { make in
      make.edges.equalToSuperview().inset(UIEdgeInsets(top: 16, left: 16, bottom: 16, right: 16))
    }

    thumbnailImageView.snp.makeConstraints { make in
      make.size.equalTo(80)
    }
  }

  func configure(title: String, description: String, date: Date, imageUrl: String?) {
    titleLabel.text = title
    descriptionLabel.text = description

    // 格式化日期
    let formatter = DateFormatter()
    formatter.dateStyle = .medium
    formatter.timeStyle = .short
    dateLabel.text = formatter.string(from: date)

    // 使用 SDWebImage 加载图片
    if let imageUrl = imageUrl {
      thumbnailImageView.isHidden = false
      thumbnailImageView.sd_setImage(
        with: URL(string: imageUrl),
        placeholderImage: nil,
        options: [.transformAnimatedImage],
        completed: nil
      )
    } else {
      thumbnailImageView.isHidden = true
    }
  }

  override func prepareForReuse() {
    super.prepareForReuse()
    thumbnailImageView.image = nil
    thumbnailImageView.isHidden = false
  }

  @available(*, unavailable)
  required init?(coder _: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }
}
