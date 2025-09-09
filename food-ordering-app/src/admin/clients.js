import {
    List, Edit, Create,
    Datagrid, SimpleForm,
    TextField, ImageField,
    TextInput, ImageInput, FunctionField,
    DateField
} from 'react-admin';

const clientFilters = [
  <TextInput label="Tìm kiếm" source="q" alwaysOn />
];

// Hàm render ảnh
const renderClientImage = (record) => (
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

// ✅ Danh sách loại món ăn
export const ClientList = (props) => (
    <List filters={clientFilters} {...props}>
        <Datagrid rowClick="edit">
            <TextField source="name" label="Name" />
            <FunctionField render={renderClientImage} label="Image" />
            <DateField source="createdAt" label="Tạo lúc" showTime />
            <DateField source="updatedAt" label="Cập nhật lúc" showTime />
        </Datagrid>
    </List>
);

// Chỉnh sửa loại 
export const ClientEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="name" label="Name" />
            <ImageField source="image" label="Current Image" />
            <ImageInput source="image" label="Upload New Image" accept="image/*">
                <ImageField source="src" title="title" />
            </ImageInput>
        </SimpleForm>
    </Edit>
);

// Tạo mới loại 
export const ClientCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="name" label="Name" />
            <ImageInput source="image" label="Image" accept="image/*">
                <ImageField source="src" title="title" />
            </ImageInput>
        </SimpleForm>
    </Create>
);
