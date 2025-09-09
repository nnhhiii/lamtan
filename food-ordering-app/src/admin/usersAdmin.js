import {
    List,
    Datagrid,
    TextField,
    Edit,
    SimpleForm,
    TextInput,
    Create,
    DateField
} from 'react-admin';

const userFilters = [
  <TextInput label="Tìm kiếm" source="q" alwaysOn />
];

// Hiển thị danh sách người dùng
export const UserAdminList = (props) => (
    <List filters={userFilters} {...props}>
        <Datagrid rowClick="edit">
            <TextField source="username" label="Username" />
            <DateField source="createdAt" label="Tạo lúc" showTime />
            <DateField source="updatedAt" label="Cập nhật lúc" showTime />
        </Datagrid>
    </List>
);

// Chỉnh sửa người dùng
export const UserAdminEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="username" label="Username"/>
        </SimpleForm>
    </Edit>
);

// Tạo người dùng mới
export const UserAdminCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="username" label="Username" />
            <TextInput source="password" type="password" label="Password" />
        </SimpleForm>
    </Create>
);