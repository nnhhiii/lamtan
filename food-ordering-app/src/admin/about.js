import {
    List, Edit, Create, Datagrid, SimpleForm,
    TextField, ImageField, TextInput, ImageInput,
    DateField, ArrayInput, SimpleFormIterator
} from 'react-admin';

// ✅ Danh sách About (thường chỉ có 1)
export const AboutList = (props) => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="name" label="Tên công ty" />
            <TextField source="description" label="Mô tả" />
            <ImageField source="logo" label="Logo" />
            <ImageField source="bannerSideLeftBar" label="Banner" />
            <DateField source="createdAt" label="Tạo lúc" showTime />
            <DateField source="updatedAt" label="Cập nhật lúc" showTime />
        </Datagrid>
    </List>
);

// ✅ Chỉnh sửa About
export const AboutEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="name" label="Tên công ty" />
            <TextInput source="description" label="Mô tả" multiline />
            
            <ImageField source="logo" label="Logo hiện tại" />
            <ImageInput source="logo" label="Logo mới" accept="image/*">
                <ImageField source="src" title="title" />
            </ImageInput>

            <ImageField source="bannerSideLeftBar" label="Banner hiện tại" />
            <ImageInput source="bannerSideLeftBar" label="Banner mới" accept="image/*">
                <ImageField source="src" title="title" />
            </ImageInput>

            <ArrayInput source="address" label="Địa chỉ">
                <SimpleFormIterator>
                    <TextInput />
                </SimpleFormIterator>
            </ArrayInput>

            <ArrayInput source="hotline" label="Hotline">
                <SimpleFormIterator>
                    <TextInput />
                </SimpleFormIterator>
            </ArrayInput>

            <TextInput source="facebook" label="Facebook" />
            <TextInput source="zalo" label="Zalo" />
        </SimpleForm>
    </Edit>
);

// ✅ Tạo mới About
export const AboutCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="name" label="Tên công ty" />
            <TextInput source="description" label="Mô tả" multiline />

            <ImageInput source="logo" label="Logo" accept="image/*">
                <ImageField source="src" title="title" />
            </ImageInput>

            <ImageInput source="bannerSideLeftBar" label="Banner" accept="image/*">
                <ImageField source="src" title="title" />
            </ImageInput>

            <ArrayInput source="address" label="Địa chỉ">
                <SimpleFormIterator>
                    <TextInput />
                </SimpleFormIterator>
            </ArrayInput>

            <ArrayInput source="hotline" label="Hotline">
                <SimpleFormIterator>
                    <TextInput />
                </SimpleFormIterator>
            </ArrayInput>

            <TextInput source="facebook" label="Facebook" />
            <TextInput source="zalo" label="Zalo" />
        </SimpleForm>
    </Create>
);
