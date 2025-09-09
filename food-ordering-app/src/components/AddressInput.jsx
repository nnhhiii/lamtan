import { useState, useMemo } from "react";
import {
    Autocomplete,
    TextField,
    CircularProgress,
} from "@mui/material";
import debounce from "lodash.debounce";

const AddressInput = ({ value, onChange }) => {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const fetchPlaces = async (query) => {
        if (query.length > 2) {
            setLoading(true);
            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(
                        query
                    )}`
                );
                const data = await res.json();
                setOptions(data);
                if (data.length > 0) setOpen(true); // ✅ chỉ mở khi có kết quả
            } catch (err) {
                console.error("Lỗi fetch địa chỉ:", err);
            } finally {
                setLoading(false);
            }
        } else {
            setOptions([]);
            setOpen(false);
        }
    };

    const debouncedFetch = useMemo(() => debounce(fetchPlaces, 300), []);

    const handleInputChange = (_, newInputValue, reason) => {
        onChange(newInputValue);
        if (reason === "input") {
            debouncedFetch(newInputValue);
        }
    };

    const handleSelect = (_, newValue) => {
        if (newValue) {
            onChange(newValue.display_name || "");
        }
        setOpen(false);
    };

    return (
        <Autocomplete
            freeSolo
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            options={options}
            getOptionLabel={(option) =>
                typeof option === "string" ? option : option.display_name
            }
            value={value || ""}
            onChange={handleSelect}
            onInputChange={handleInputChange}
            loading={loading}
            filterOptions={(x) => x} // ✅ quan trọng: tắt filter mặc định, để nó show raw data
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Địa chỉ"
                    fullWidth
                    slotProps={{
                        input: {
                            ...params.InputProps,
                        },
                        inputAdornment: {
                            children: (
                                <>
                                    {loading ? <CircularProgress size={20} /> : null}
                                    {params.InputProps?.endAdornment}
                                </>
                            ),
                        },
                    }}
                />
            )}
        />
    );
};

export default AddressInput;
