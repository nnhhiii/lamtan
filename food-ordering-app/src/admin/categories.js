import {
    List, Edit, Create,
    Datagrid, SimpleForm,
    TextField, ImageField,
    TextInput, ImageInput, FunctionField,
    DateField
} from 'react-admin';

const categoryFilters = [
  <TextInput label="Tìm kiếm" source="q" alwaysOn />
];

// Hàm render ảnh
const renderCategoryImage = (record) => (
    record.image ? (
        <div
            style={{
                width: '150px',
                height: '100px',
                backgroundImage: `url(${record.image})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                borderRadius: '6px',
                margin: '5px auto'
            }}
        />
    ) : <div>No Image</div>
);
const renderCategoryImage1 = (record) => (
    record.banner ? (
        <div
            style={{
                width: '150px',
                height: '100px',
                backgroundImage: `url(${record.banner})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                borderRadius: '6px',
                margin: '5px auto'
            }}
        />
    ) : <div>No Image</div>
);

// ✅ Danh sách loại món ăn
export const CategoryList = (props) => (
    <List filters={categoryFilters} {...props}>
        <Datagrid rowClick="edit">
            <TextField source="name" label="Tên loại" />
            <TextField source="description" label="Mô tả" />
            <FunctionField render={renderCategoryImage} label="Ảnh" />
            <FunctionField render={renderCategoryImage1} label="Ảnh Banner" />
            <DateField source="createdAt" label="Tạo lúc" showTime />
            <DateField source="updatedAt" label="Cập nhật lúc" showTime />
        </Datagrid>
    </List>
);

// Chỉnh sửa loại 
export const CategoryEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="name" label="Name" />
            <TextInput source="description" label="Description" />
            <ImageField source="image" label="Current Image" />
            <ImageInput source="image" label="Upload New Image" accept="image/*">
                <ImageField source="src" title="title" />
            </ImageInput>
            <ImageField source="banner" label="Current Banner" />
            <ImageInput source="banner" label="Upload New Banner" accept="image/*">
                <ImageField source="src" title="title" />
            </ImageInput>
        </SimpleForm>
    </Edit>
);

// Tạo mới loại 
export const CategoryCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="name" label="Name" />
            <TextInput source="description" label="Description" />
            <ImageInput source="image" label="Image" accept="image/*">
                <ImageField source="src" title="title" />
            </ImageInput>
            <ImageInput source="banner" label="Upload New Banner" accept="image/*">
                <ImageField source="src" title="title" />
            </ImageInput>
        </SimpleForm>
    </Create>
);
