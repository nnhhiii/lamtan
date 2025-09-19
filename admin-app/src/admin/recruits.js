import {
    List,
    Datagrid,
    TextField,
    Edit,
    SimpleForm,
    TextInput,
    DateField,
    SelectInput,
    FunctionField, ReferenceInput,
    ReferenceField,
    ChipField
} from 'react-admin';

const userFilters = [
    <TextInput label="Tìm kiếm" source="q" alwaysOn />
];
const statusChoices = [
    { id: 'new', name: 'Mới' },
    { id: 'reviewing', name: 'Đang duyệt' },
    { id: 'interview', name: 'Phỏng vấn' },
    { id: 'offer', name: 'Offer (công ty đưa ra thư mời nhận việc)' },
    { id: 'hired', name: 'Nhận' },
    { id: 'rejected', name: 'Loại' },
];

// Custom field để hiển thị CV
const CvField = ({ source, record = {} }) => {
    const url = record[source];
    if (!url) return <span>Không có CV</span>;

    return (
        <a href={url} target="_blank" rel="noopener noreferrer" >
            📄 Xem CV
        </a>
    );
};


// Danh sách
export const RecruitList = (props) => (
    <List filters={userFilters} {...props}>
        <Datagrid rowClick="edit">
            <TextField source="fullName" label="Họ tên" />
            <TextField source="email" label="Email" />
            <TextField source="phone" label="SĐT" />
            <ReferenceField source="position" reference="positions" label="Vị trí ứng tuyển">
                <TextField source="title" />
            </ReferenceField>
            <FunctionField
                label="CV"
                render={(record) => <CvField source="cvUrl" record={record} />}
            />
            <TextField source="status" label="Trạng thái" />
            <FunctionField
                label="Trạng thái"
                render={(record) => {
                    const choice = statusChoices.find(c => c.id === record.status);
                    return <ChipField record={{ status: choice?.name }} source="status" />;
                }}
            />
            <DateField source="createdAt" label="Ứng tuyển lúc" showTime />
        </Datagrid>
    </List>
);

// Form chỉnh sửa
export const RecruitEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="fullName" label="Họ tên" InputProps={{ readOnly: true }} />
            <TextInput source="email" label="Email" InputProps={{ readOnly: true }} />
            <TextInput source="phone" label="SĐT" InputProps={{ readOnly: true }} />
            <ReferenceInput source="position" reference="positions" label="Vị trí ứng tuyển">
                <SelectInput optionText="title" InputProps={{ readOnly: true }} />
            </ReferenceInput>
            <FunctionField
                label="CV"
                render={(record) => <CvField source="cvUrl" record={record} />}
            />
            <TextInput source="message" label="Thư giới thiệu" multiline fullWidth InputProps={{ readOnly: true }} />
            <SelectInput
                source="status"
                label="Trạng thái"
                choices={statusChoices}
            />
            <TextInput
                source="consent"
                label="Đồng ý xử lý dữ liệu cá nhân"
                InputProps={{ readOnly: true }}
                format={value => (value ? "Đồng ý" : "Không đồng ý")}
            />

        </SimpleForm>
    </Edit>
);

