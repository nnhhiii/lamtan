import {
    List,
    Datagrid,
    TextField,
    Edit,
    SimpleForm,
    TextInput,
    Create,
    DateField,
    SelectInput
} from 'react-admin';
// Form chỉnh sửa
import { useEffect, useState } from 'react';
import { getAbout } from '../api/api';


const useAddressChoices = () => {
    const [addresses, setAddresses] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAbout();
                const allAddresses = data.flatMap(item => item.address || []);
                const choices = allAddresses.map(addr => ({
                    id: addr,
                    name: addr,
                }));
                setAddresses(choices);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    return addresses;
};


// Danh sách
export const PositionList = (props) => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="title" label="Tên công việc" />
            <TextField source="workAddress" label="Địa điểm" />
            <TextField source="salary" label="Mức lương" />
            <TextField source="status" label="Trạng thái" />
            <DateField source="createdAt" label="Tạo lúc" showTime />
            <DateField source="updatedAt" label="Cập nhật lúc" showTime />
        </Datagrid>
    </List>
);


export const PositionEdit = () => {
    const addresses = useAddressChoices();
    return (
        <Edit>
            <SimpleForm>
                <TextInput source="title" label="Tên công việc" fullWidth />
                <TextInput source="description" label="Mô tả" multiline fullWidth />
                <TextInput source="requirements" label="Yêu cầu" multiline fullWidth />
                <TextInput source="benefits" label="Quyền lợi" multiline fullWidth />
                <SelectInput
                    source="workAddress"
                    label="Địa điểm"
                    choices={addresses}
                />
                <TextInput source="salary" label="Mức lương" />
                <SelectInput
                    source="type"
                    label="Loại hình"
                    choices={[
                        { id: 'fulltime', name: 'Fulltime' },
                        { id: 'parttime', name: 'Parttime' },
                        { id: 'internship', name: 'Thực tập sinh' },
                        { id: 'contract', name: 'Hợp đồng ngắn hạn (theo dự án, freelancer,...)' },
                    ]}
                />
                <SelectInput
                    source="status"
                    label="Trạng thái"
                    choices={[
                        { id: 'open', name: 'Đang tuyển' },
                        { id: 'closed', name: 'Đã đóng' },
                    ]}
                />
            </SimpleForm>
        </Edit>
    );
};

// Form tạo mới
export const PositionCreate = () => {
    const addresses = useAddressChoices();
    return (
        <Create>
            <SimpleForm>
                <TextInput source="title" label="Tên công việc" fullWidth />
                <TextInput source="description" label="Mô tả" multiline fullWidth />
                <TextInput source="requirements" label="Yêu cầu" multiline fullWidth />
                <TextInput source="benefits" label="Quyền lợi" multiline fullWidth />
                <SelectInput
                    source="workAddress"
                    label="Địa điểm"
                    choices={addresses}
                />
                <TextInput source="salary" label="Mức lương" />
                <SelectInput
                    source="type"
                    label="Loại hình"
                    choices={[
                        { id: 'fulltime', name: 'Fulltime' },
                        { id: 'parttime', name: 'Parttime' },
                        { id: 'internship', name: 'Thực tập sinh' },
                        { id: 'contract', name: 'Hợp đồng ngắn hạn (theo dự án, freelancer,...)' },
                    ]}
                />
            </SimpleForm>
        </Create>
    )
};
