import {
    List, Edit, Create,
    Datagrid, SimpleForm,
    TextField, TextInput, DateField
} from 'react-admin';

const categoryFilters = [
    <TextInput label="Tìm kiếm" source="q" alwaysOn />
];

// ✅ Danh sách category
export const PostCategoryList = (props) => (
    <List filters={categoryFilters} {...props}>
        <Datagrid rowClick="edit">
            <TextField source="name" label="Tên danh mục" />
            <TextField source="description" label="Mô tả" />
            <DateField source="createdAt" label="Tạo lúc" showTime />
            <DateField source="updatedAt" label="Cập nhật lúc" showTime />
        </Datagrid>
    </List>
);

// ✅ Chỉnh sửa category
export const PostCategoryEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="name" label="Tên danh mục" />
            <TextInput source="description" label="Mô tả" multiline />
        </SimpleForm>
    </Edit>
);

// ✅ Tạo mới category
export const PostCategoryCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="name" label="Tên danh mục" />
            <TextInput source="description" label="Mô tả" multiline />
        </SimpleForm>
    </Create>
);
