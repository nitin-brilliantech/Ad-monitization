import React from 'react';
import { useController } from 'react-hook-form';
import Label from '../label/Label';

const Checkbox = ({
  name,
  label,
  options,
  control,
  labelProps = {},
  inputProps = {},
}) => {
  const { field } = useController({ name, control });

  const handleChange = value => {
    const newValue = field.value?.includes(value)
      ? field.value.filter(v => v !== value)
      : [...(field.value || []), value];
    field.onChange(newValue);
  };

  return (
    <div className='mb-4'>
      <Label text={label} {...labelProps} />
      <div className='flex flex-wrap gap-3'>
        {options.map(opt => {
          const isChecked = field.value?.includes(opt.value);
          return (
            <label
              key={opt.value}
              className='inline-flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none'
            >
              {/* Custom checkbox */}
              <span
                className={`
                  flex items-center justify-center w-[18px] h-[18px] rounded-[5px] shrink-0
                  border-[1.5px] transition-all duration-150
                  ${isChecked
                    ? 'bg-[#4684ff] border-[#4684ff]'
                    : 'bg-white border-gray-300 hover:border-[#4684ff]'
                  }
                `}
              >
                {isChecked && (
                  <svg
                    className='w-2.5 h-2.5 text-white'
                    viewBox='0 0 10 8'
                    fill='none'
                  >
                    <path
                      d='M1 4l2.5 2.5L9 1'
                      stroke='currentColor'
                      strokeWidth='1.8'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                )}
              </span>

              {/* Hidden native checkbox for accessibility */}
              <input
                type='checkbox'
                value={opt.value}
                checked={isChecked}
                onChange={() => handleChange(opt.value)}
                className='sr-only'
                {...inputProps}
              />

              {opt.label}
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default Checkbox;
