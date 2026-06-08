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
        {options.map(opt => (
          <label
            key={opt.value}
            className='inline-flex items-center text-sm text-gray-700'
          >
            <input
              type='checkbox'
              value={opt.value}
              checked={field.value?.includes(opt.value)}
              onChange={() => handleChange(opt.value)}
              className='mr-2'
              {...inputProps}
            />
            {opt.label}
          </label>
        ))}
      </div>
    </div>
  );
};

export default Checkbox;
