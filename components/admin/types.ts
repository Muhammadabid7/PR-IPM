export type Member = {
    id: string;
    name: string;
    nis: string;
    jurusan: string;
    phone: string;
    status: 'Pra-TM' | 'TM1' | 'TM2';
    skill: string;
};

export type Transaction = {
    id: string;
    type: 'in' | 'out';
    label: string;
    amount: number;
    date?: any;
};

export type EventItem = {
    id: string;
    title: string;
    date: string;
    attendance: number;
    total: number;
    description?: string;
    location?: string;
};

export type Aspiration = {
    id: string;
    name: string;
    message: string;
    status: 'Diterima' | 'Sedang Diproses' | 'Selesai';
    createdAt?: any;
};
