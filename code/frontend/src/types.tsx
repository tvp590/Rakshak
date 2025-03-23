export interface ThemeContextType {
    isDarkMode: boolean;
    toggleTheme: () => void;
}

export interface NavbarProps {
    isLoggedIn: boolean;
    onLogout: () => void;
}

export enum Role {
    User = 'user',
    SuperAdmin = 'superAdmin',
    SiteAdmin = 'siteAdmin'
}
  
export interface SidebarProps {
    user: {
      role: Role | null;
      name: string | null;
    };
}

export interface CustomFormGroupProps {
    label: string;
    type: string;
    name: string;
    value: string | number| null | undefined;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    placeholder?: string;
    required?: boolean;
    disabled? : boolean;
}

export interface LayoutProps {
    children: React.ReactNode;
    pageTitle: string;
    isLoggedIn: boolean;
    onLogout: () => void;
}

export interface User {
    id: number;
    name: string | null;
    email: string | null;
    role: Role | null; 
    institution_id: number | null;
    created_at: string | null;
    updated_at: string | null;
}

export interface UserContextProps {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    clearUser: () => void;
}

export interface ToggleSignUpTypeProps {
    isInstitution: boolean;
    setIsInstitution: (val: boolean) => void;
}

export interface UserFormProps {
    name: string;
    setName: (value: string) => void;
    email: string;
    setEmail: (value: string) => void;
    password: string;
    setPassword: (value: string) => void;
    confirmPassword: string;
    setConfirmPassword: (value: string) => void;
    institutionCode: string;
    setInstitutionCode: (value: string) => void;
}

export interface InstitutionFormProps {
    institutionName: string;
    setInstitutionName: (value: string) => void;
    institutionEmail: string;
    setInstitutionEmail: (value: string) => void;
    institutionContact: string;
    setInstitutionContact: (value: string) => void;
    institutionAddress: string;  // Added this line
    setInstitutionAddress: (value: string) => void;
    password: string;
    setPassword: (value: string) => void;
    confirmPassword: string;
    setConfirmPassword: (value: string) => void;
}

export interface CCTV {
    id: number;
    name: string;
    location: string;
    ip_address: string;
    is_active: boolean;  
    institution_id: number; 
    username:string | null;
    password:string | null;
}

export interface CCTVFeed {
    id: number;          
    cameraName: string;  
    location: string;    
    streamURL: string;  
    // alert: boolean;
}

export interface CCTVFeedModalProps {
    showModal: boolean;
    selectedFeed: CCTVFeed | null;
    handleCloseModal: () => void;
    isDarkMode: boolean;
}

export interface CCTVFeedCardProps {
    feed: CCTVFeed;
    isDarkMode: boolean;
    onClick: () => void;
    highlight?: boolean;
}

export interface ActiveStream {
    cctv_id: number;
    stream_url: string;
    location: string;
}

export interface ActiveStreamsResponse {
    active_streams: ActiveStream[];
    error?: string;
}

export interface AlertModalProps {
    show: boolean;
    alert: Alerts | null;
    onClose: () => void;
}

export type Alerts = {
    id: number;
    weapon_type: string;
    status: string;
    is_active: boolean;
    image_path: string;
    created_at: string; 
    updated_at: string;  
    cctv_id: number;
    institution_id: number;
    location: string | null;
};

export interface AlertsTableProps {
    alerts: Alerts[];
    onViewAlert: (alert: Alerts) => void;
    isDarkMode: boolean;
}

export interface CCTVFormProps {
    show: boolean;
    onHide: () => void;
    onSubmit: (data: CCTV) => void;
    initialData: CCTV | null;
}

export interface CCTVTableProps{
    cctvs: CCTV[];
    searchCCTV: string;
    onEdit: (cctv: CCTV) => void;
    onRemove: (id: number) => void;
}

export interface UserModalProps {
    show: boolean;
    onHide: () => void;
    onSave: (user: Omit<User, "id" | "created_at" | "updated_at">) => void;
    user: User | null;
    handleChange: (e: React.ChangeEvent<HTMLInputElement  |HTMLTextAreaElement |  HTMLSelectElement>) => void;
    formData: {
        name: string | null;
        email: string | null;
        password: string | null;
        role: Role | null;
        institution_id: number | null;
    };
}

export interface UserTableProps {
    users: User[];
    isDarkMode: boolean;
    onEdit: (user: User) => void;
    onRemove: (userid: number) => void;
}

export interface InstitutionModalProps {
    show: boolean;
    onHide: () => void;
    onSave: (institution: Institution) => void;
    institution: Institution | null;
}

export interface Institution {
    id: number;
    name: string;
    address: string;
    email:string;
    phone: string;
  }
  
export interface InstitutionTableProps {
    institutions: Institution[];
    filteredInstitutions: Institution[];
    onEdit: (institution: Institution) => void;
    onRemove: (institution: Institution) => void;
}

export interface WeaponAlertData {
    cctv_id: number;
    location: string;
}

export interface WeaponAlertContextType {
    message: string | null;
    triggerMessage: (msg: string) => void;
    highlightedFeedId: number | null
}


