import { useEffect, useState } from 'react';
import axios from 'axios';
import { Controller } from 'react-hook-form';
import Select from 'react-select';

const selectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: "44px",
    height: "44px",
    borderRadius: "10px",
    borderWidth: "1.5px",
    borderColor: state.isFocused ? "#4684ff" : "#d1d5db",
    boxShadow: state.isFocused
      ? "0 0 0 4px rgba(70,132,255,0.13), 0 6px 16px rgba(15,23,42,0.08)"
      : "none",
    transform: state.isFocused ? "translateY(-2px)" : "none",
    backgroundColor: "#ffffff",
    transition: "border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease",
    "&:hover": { borderColor: state.isFocused ? "#4684ff" : "#a0aec0" },
    cursor: "pointer",
  }),
  valueContainer: (base) => ({ ...base, padding: "0 12px", height: "44px" }),
  input: (base) => ({ ...base, margin: 0, padding: 0, fontSize: "14px" }),
  singleValue: (base) => ({ ...base, fontSize: "14px", color: "#0f172a" }),
  placeholder: (base) => ({ ...base, fontSize: "14px", color: "#9ca3af" }),
  indicatorsContainer: (base) => ({ ...base, height: "44px" }),
  indicatorSeparator: () => ({ display: "none" }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  menu: (base) => ({
    ...base,
    borderRadius: "12px",
    boxShadow: "0 20px 40px rgba(15,23,42,0.12), 0 4px 12px rgba(15,23,42,0.06)",
    border: "1.5px solid #e5e7eb",
    overflow: "hidden",
    marginTop: "6px",
  }),
  menuList: (base) => ({ ...base, padding: "4px", maxHeight: "220px" }),
  option: (base, state) => ({
    ...base,
    fontSize: "14px",
    borderRadius: "8px",
    margin: "1px 0",
    padding: "8px 12px",
    backgroundColor: state.isSelected ? "#4684ff" : state.isFocused ? "rgba(70,132,255,0.08)" : "transparent",
    color: state.isSelected ? "#fff" : "#0f172a",
    cursor: "pointer",
    transition: "background-color 120ms ease",
  }),
};

const LocationFields = ({ control, setValue, watch, errors, isPincode = true, customStyles, isRequired = false, labelClassName = "block text-sm" }) => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const watchedCountry = watch('country');

  useEffect(() => {
    axios.get('https://countriesnow.space/api/v0.1/countries/positions')
      .then(res => {
        const options = res.data.data.map(c => ({ label: c.name, value: c.name }));
        setCountries(options);
        //console.log(options);
      })
      .catch(err => console.error('Error loading countries', err));
  }, []);

  const handleCountryChange = async (selected) => {
    const country = selected?.value || '';
    setValue('country', country);
    setValue('state', '');
    setValue('city', '');
    setStates([]);
    setCities([]);

    if (country) {
      try {
        const res = await axios.post('https://countriesnow.space/api/v0.1/countries/states', { country });
        const options = res.data.data.states.map(s => ({ label: s.name, value: s.name }));
        setStates(options);
      } catch (err) {
        console.error('Error loading states', err);
      }
    }
  };

  const handleStateChange = async (selected) => {
    const state = selected?.value || '';
    setValue('state', state);
    setValue('city', '');
    setCities([]);

    if (state && watchedCountry) {
      try {
        const res = await axios.post('https://countriesnow.space/api/v0.1/countries/state/cities', {
          country: watchedCountry,
          state,
        });
        const options = res.data.data.map(c => ({ label: c, value: c }));
        setCities(options);
      } catch (err) {
        console.error('Error loading cities', err);
      }
    }
  };

  const handlePincodeChange = async (pincode) => {
    setValue('pincode', pincode);

    if (pincode.length === 6) {
      try {
        const res = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
        if (res.data?.[0]?.Status === 'Success') {
          const { State, District } = res.data[0].PostOffice[0];
          const country = 'India';

          const countryOption = { label: country, value: country };
          const stateOption = { label: State, value: State };
          const cityOption = { label: District, value: District };

          setValue('country', country);
          setValue('state', State);
          setValue('city', District);

          const statesRes = await axios.post('https://countriesnow.space/api/v0.1/countries/states', { country });
          const statesOptions = statesRes.data.data.states.map(s => ({ label: s.name, value: s.name }));
          setStates(statesOptions);

          const citiesRes = await axios.post('https://countriesnow.space/api/v0.1/countries/state/cities', {
            country,
            state: State,
          });
          const citiesOptions = citiesRes.data.data.map(c => ({ label: c, value: c }));
          setCities(citiesOptions);
        }
      } catch (err) {
        console.error('Pincode lookup failed:', err);
      }
    }
  };

  return (
    <>
      {/* Pincode (optional) */}
      {isPincode && (
        <Controller
          name="pincode"
          control={control}
          rules={{
            pattern: {
              value: /^[0-9]{6}$/,
              message: 'Pincode must be 6 digits',
            },
          }}
          render={({ field }) => (
            <div className="space-y-1">
              <label className="block text-sm">
                Pincode <span className="text-xs text-gray-500">(optional)</span>
              </label>
              <input
                {...field}
                type="text"
                maxLength={6}
                placeholder="Enter Pincode"
                onChange={(e) => {
                  field.onChange(e.target.value);
                  handlePincodeChange(e.target.value);
                }}
                className="w-full rounded-[10px] border-[1.5px] border-gray-300 px-3 py-2 text-sm"
              />
              {errors.pincode && <p className="text-red-500 text-sm">{errors.pincode.message}</p>}
            </div>
          )}
        />
      )}

      {/* Country */}
      <Controller
        name="country"
        control={control}
        rules={{ required: 'Country is required' }}
        render={({ field }) => (
          <div className="space-y-1">
              <label className={labelClassName}>
                Country {isRequired && <span className="text-red-500">*</span>}
              </label>
            <div className={customStyles}>

            <Select
              {...field}
              options={countries}
              onChange={(selected) => {
                field.onChange(selected?.value || '');
                handleCountryChange(selected);
              }}
              value={countries.find(c => c.value === field.value) || null}
              placeholder="Select Country"
              styles={selectStyles}
              menuPortalTarget={typeof document !== "undefined" ? document.body : null}
              menuPosition="fixed"
              classNames={{ menu: () => "bts-menu-animated" }}
            />
            </div>
            {errors.country && <p className="text-red-500 text-sm">{errors.country.message}</p>}
          </div>
        )}
      />

      {/* State */}
      <Controller
        name="state"
        control={control}
        rules={{ required: 'State is required' }}
        render={({ field }) => (
          <div className="space-y-1">
              <label className={labelClassName}>
                State {isRequired && <span className="text-red-500">*</span>}
              </label>
            <div className={customStyles}>

            <Select
              {...field}
              options={states}
              isDisabled={!states.length}
              onChange={(selected) => {
                field.onChange(selected?.value || '');
                handleStateChange(selected);
              }}
              value={states.find(s => s.value === field.value) || null}
              placeholder="Select State"
              styles={selectStyles}
              menuPortalTarget={typeof document !== "undefined" ? document.body : null}
              menuPosition="fixed"
              classNames={{ menu: () => "bts-menu-animated" }}
            />
            </div>
            {errors.state && <p className="text-red-500 text-sm">{errors.state.message}</p>}
          </div>
        )}
      />

      {/* City */}
      <Controller
        name="city"
        control={control}
        rules={{ required: 'City is required' }}
        render={({ field }) => (
          <div className="space-y-1">
            <label className="block text-sm">City</label>
            <div className={customStyles}>

            <Select
              {...field}
              options={cities}
              isDisabled={!cities.length}
              onChange={(selected) => {
                field.onChange(selected?.value || '');
              }}
              value={cities.find(c => c.value === field.value) || null}
              placeholder="Select City"
              styles={selectStyles}
              menuPortalTarget={typeof document !== "undefined" ? document.body : null}
              menuPosition="fixed"
              classNames={{ menu: () => "bts-menu-animated" }}
            />
            </div>
            {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
          </div>
        )}
      />
    </>
  );
};

export default LocationFields;