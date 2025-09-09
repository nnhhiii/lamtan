import {
    List,
    Datagrid,
    TextField, EmailField,
    Edit,
    SimpleForm,
    TextInput,
    ImageField,
    DateField, FunctionField,
} from 'react-admin';

const userFilters = [
  <TextInput label="Tìm kiếm" source="q" alwaysOn />
];

// Hiển thị danh sách người dùng
export const UserList = (props) => (
    <List filters={userFilters} {...props}>
        <Datagrid rowClick="edit">
            <TextField source="username" label="Tên" />
            <EmailField source="email" label="Email" />
            <TextField source="phone" label="Số điện thoại" />
            <TextField source='address' label="Địa chỉ" />
            <TextField source='addressDetail' label="Địa chỉ cụ thể" />
            <FunctionField label="Ảnh"
                render={record => record.image? (
                        <div
                            style={{
                                width: '100px',
                                height: '100px',
                                backgroundImage: `url(${record.image})`,
                                backgroundPosition: 'center',
                                backgroundSize: 'cover',
                                borderRadius: '50px',
                                margin: '5px auto'
                            }}
                        />
                    ) : (<div> No Image </div>)
                }
            />
            <DateField source="createdAt" label="Tạo lúc" showTime />
            <DateField source="updatedAt" label="Cập nhật lúc" showTime />
        </Datagrid>
    </List>
);

// Chỉnh sửa người dùng
export const UserEdit = () => (
    <Edit>
        <SimpleForm toolbar={false}>
            <TextInput source="username" label="Name" InputProps={{ readOnly: true }}/>
            <TextInput source="email" label="Email" InputProps={{ readOnly: true }}/>
            <TextInput source="phone" label="Số điện thoại" InputProps={{ readOnly: true }}/>
            <TextInput source='address' label="Địa chỉ" InputProps={{ readOnly: true }}/>
            <TextInput source='addressDetail' label="Địa chỉ cụ thể" InputProps={{ readOnly: true }}/>
            <ImageField source="image" label="Current Image" />
        </SimpleForm>
    </Edit>
);

// Tạo người dùng mới
// export const UserCreate = () => (
//     <Create>
//         <SimpleForm>
//             <TextInput source="username" label="Name" />
//             <TextInput source="email" label="Email" />
//             <TextInput source="phone" label="Số điện thoại" />
//             <TextInput source='address' label="Địa chỉ" />
//             <TextInput source="password" type="password" label="Password" />
//             <ImageInput source="image" label="image">
//                 <ImageField source="src" title="title" />
//             </ImageInput>
//         </SimpleForm>
//     </Create>
// );
