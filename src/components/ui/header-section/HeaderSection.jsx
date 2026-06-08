import Button from '../button/Button';

const HeaderSection = ({
  title,
  subtitle,
  showButton = true,
  buttonLabel = 'Create Campaign',
  onButtonClick,
  titleClass = '',
  subtitleClass = '',
  containerClass = '',
  buttonClass = '',
}) => {
  const showTextBlock = subtitle || title;

  return (
    <div className={containerClass || 'flex items-center justify-between mb-2 w-full'}>
      {showTextBlock && (
        <div className="flex items-center gap-2">
          {title && (
            <h1 className={titleClass || 'text-2xl font-semibold text-gray-800'}>
              {title}
            </h1>
          )}
          {subtitle && (
            <h2 className={subtitleClass || 'text-2xl  text-[#445E94]'}>
              {subtitle}
            </h2>
          )}
        </div>
      )}

      {showButton && (
        <Button
          label={buttonLabel}
          onClick={onButtonClick}
          className={buttonClass}
          type='button'
        />
      )}
    </div>
  );
};

export default HeaderSection;
