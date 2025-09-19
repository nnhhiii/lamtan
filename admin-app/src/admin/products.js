import {
    ReferenceField,
    useInput,
    List,
    Datagrid,
    TextField,
    Edit,
    SimpleForm,
    TextInput,
    Create,
    SelectInput,
    DateField,
    ReferenceInput,
    FunctionField,
    SimpleFormIterator,
    NumberInput,
    BooleanInput,
    ArrayInput,
    NumberField, BooleanField
} from 'react-admin';
import { RichTextInput } from 'ra-input-rich-text';

const productFilters = [
    <TextInput label="Tìm kiếm" source="q" alwaysOn />
];

// Custom field để upload và hiển thị ảnh
const CustomInputImagesField = ({ source }) => {
    const { field } = useInput({ source });

    // Ép giá trị thành mảng
    const images = Array.isArray(field.value) ? field.value : [];
    const onChange = field.onChange;

    const handleDelete = (index) => {
        const updatedImages = images.filter((_, i) => i !== index);
        onChange(updatedImages);
    };

    const handleAddNewImages = (fileList) => {
        const newImages = Array.from(fileList).map((file) => ({
            rawFile: file,
            src: URL.createObjectURL(file)
        }));
        onChange([...images, ...newImages]);
    };

    return (
        <div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {images.map((image, index) => (
                    <div key={index} style={{ position: 'relative' }}>
                        <div
                            style={{
                                width: '250px',
                                height: '150px',
                                backgroundImage: `url(${image.src || image})`,
                                backgroundPosition: 'center',
                                backgroundSize: 'cover',
                                borderRadius: '10px',
                                border: '1px solid #ccc',
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => handleDelete(index)}
                            style={{
                                position: 'absolute',
                                top: '-5px',
                                right: '0',
                                background: 'transparent',
                                border: 'none',
                                padding: '5px 10px',
                                fontSize: '25px',
                                cursor: 'pointer',
                            }}
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
            <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => e.target.files && handleAddNewImages(e.target.files)}
                style={{ marginTop: '10px' }}
            />
        </div>
    );
};



// Danh sách sản phẩm
export const ProductList = (props) => (
    <List filters={productFilters} {...props}>
        <Datagrid rowClick="edit">
            <TextField source="name" label="Tên sản phẩm" />
            <ReferenceField label="Loại sản phẩm" source="category" reference="categories">
                <TextField source="name" />
            </ReferenceField>
            <TextField source="description" label="Mô tả" />
            <TextField source="price" label="Giá gốc" />
            <TextField source="discount" label="Giảm giá" />
            <FunctionField
                label="Ảnh"
                render={(record) =>
                    record && record.images && record.images.length > 0 ? (
                        <div
                            style={{
                                width: '150px',
                                height: '100px',
                                backgroundImage: `url(${record.images[0]})`,
                                backgroundPosition: 'center',
                                backgroundSize: 'cover',
                                borderRadius: '6px',
                                margin: '5px auto',
                            }}
                        />
                    ) : (
                        <div>No Image</div>
                    )
                }
            />
            <NumberField source="averageRating" label="Trung bình đánh giá" />
            <NumberField source="totalRatings" label="Lượt đánh giá" />
            <NumberField source="quantitySold" label="Lượt mua" />
            <BooleanField source="isAvailable" label="Còn hàng" />
            <DateField source="createdAt" label="Tạo lúc" showTime />
            <DateField source="updatedAt" label="Cập nhật lúc" showTime />
        </Datagrid>
    </List>
);

// Chỉnh sửa sản phẩm
export const ProductEdit = () => (
        <Edit>
            <SimpleForm>
                <TextInput source="name" label="Tên sản phẩm" required />
                <RichTextInput source="description" label="Mô tả" required />
                <TextInput source="price" label="Giá gốc" required />
                <TextInput source='discount' label="Giảm giá (phần trăm % hoặc số tiền cụ thể vd: 15%, 5000)"/>
                <ReferenceInput source="category" reference="categories">
                    <SelectInput optionText="name" label="Loại sản phẩm"/>
                </ReferenceInput>
                <TextInput source="origin" label="Xuất xứ" />
                <TextInput source="ingredients" label="Thành phần"  />
                <TextInput source="expiredDay" label="Hạn sử dụng" />
                <TextInput source="preservation" label="Bảo quản" />
                <TextInput source="instruction" label="Hướng dẫn sử dụng"/>
                <BooleanInput source="isAvailable" label="Còn hàng" />
                <CustomInputImagesField source="images" />
                <ArrayInput source="variants" label="Các biến thể (vd: loại, màu sắc, kích thước, trọng lượng,...)">
                    <SimpleFormIterator>
                        <TextInput source="name" label="Tên biến thể (vd: gói 250g, 1kg, áo màu xanh, size M,...)" />
                        <CustomInputImagesField source="images" />
                        <TextInput source="price" label="Giá" />
                        <NumberInput source="stock" label="Tồn kho" />
                        <BooleanInput source="isAvailable" label="Còn hàng" />
                    </SimpleFormIterator>
                </ArrayInput>

            </SimpleForm>
        </Edit>
    );

// Tạo mới sản phẩm
export const ProductCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="name" label="Tên sản phẩm" required />
            <RichTextInput source="description" label="Mô tả" required />
            <TextInput source="price" label="Giá gốc" required />
            <TextInput source='discount' label="Giảm giá (phần trăm % hoặc số tiền cụ thể)"/>
            <ReferenceInput source="category" reference="categories" label="Loại sản phẩm">
                <SelectInput optionText="name" />
            </ReferenceInput>
            <CustomInputImagesField source="images" />

            <ArrayInput source="variants" label="Các biến thể (vd: loại, màu sắc, size,...)">
                <SimpleFormIterator>
                    <TextInput source="name" label="Tên biến thể (vd: loại, màu sắc, size,...)" />
                    <CustomInputImagesField source="images" />
                    <TextInput source="price" label="Giá" />
                    <NumberInput source="stock" label="Tồn kho" />
                    <BooleanInput source="isAvailable" label="Còn hàng" />
                </SimpleFormIterator>
            </ArrayInput>

        </SimpleForm>
    </Create>
);
