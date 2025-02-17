import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '../ui/button';
import { useEffect, useState } from 'react';
import { Pencil } from 'lucide-react';

const invoices = [
    {
        invoice: 'INV001',
        paymentStatus: 'Paid',
        totalAmount: '$250.00',
        paymentMethod: 'Credit Card',
    },
    {
        invoice: 'INV002',
        paymentStatus: 'Pending',
        totalAmount: '$150.00',
        paymentMethod: 'PayPal',
    },
    {
        invoice: 'INV003',
        paymentStatus: 'Unpaid',
        totalAmount: '$350.00',
        paymentMethod: 'Bank Transfer',
    },
    {
        invoice: 'INV004',
        paymentStatus: 'Paid',
        totalAmount: '$450.00',
        paymentMethod: 'Credit Card',
    },
    {
        invoice: 'INV005',
        paymentStatus: 'Paid',
        totalAmount: '$550.00',
        paymentMethod: 'PayPal',
    },
    {
        invoice: 'INV006',
        paymentStatus: 'Pending',
        totalAmount: '$200.00',
        paymentMethod: 'Bank Transfer',
    },
    {
        invoice: 'INV007',
        paymentStatus: 'Unpaid',
        totalAmount: '$300.00',
        paymentMethod: 'Credit Card',
    },
    {
        invoice: 'INV001',
        paymentStatus: 'Paid',
        totalAmount: '$250.00',
        paymentMethod: 'Credit Card',
    },
    {
        invoice: 'INV002',
        paymentStatus: 'Pending',
        totalAmount: '$150.00',
        paymentMethod: 'PayPal',
    },
    {
        invoice: 'INV003',
        paymentStatus: 'Unpaid',
        totalAmount: '$350.00',
        paymentMethod: 'Bank Transfer',
    },
    {
        invoice: 'INV004',
        paymentStatus: 'Paid',
        totalAmount: '$450.00',
        paymentMethod: 'Credit Card',
    },
    {
        invoice: 'INV005',
        paymentStatus: 'Paid',
        totalAmount: '$550.00',
        paymentMethod: 'PayPal',
    },
    {
        invoice: 'INV006',
        paymentStatus: 'Pending',
        totalAmount: '$200.00',
        paymentMethod: 'Bank Transfer',
    },
    {
        invoice: 'INV007',
        paymentStatus: 'Unpaid',
        totalAmount: '$300.00',
        paymentMethod: 'Credit Card',
    },
    {
        invoice: 'INV001',
        paymentStatus: 'Paid',
        totalAmount: '$250.00',
        paymentMethod: 'Credit Card',
    },
    {
        invoice: 'INV002',
        paymentStatus: 'Pending',
        totalAmount: '$150.00',
        paymentMethod: 'PayPal',
    },
    {
        invoice: 'INV003',
        paymentStatus: 'Unpaid',
        totalAmount: '$350.00',
        paymentMethod: 'Bank Transfer',
    },
    {
        invoice: 'INV004',
        paymentStatus: 'Paid',
        totalAmount: '$450.00',
        paymentMethod: 'Credit Card',
    },
    {
        invoice: 'INV005',
        paymentStatus: 'Paid',
        totalAmount: '$550.00',
        paymentMethod: 'PayPal',
    },
    {
        invoice: 'INV006',
        paymentStatus: 'Pending',
        totalAmount: '$200.00',
        paymentMethod: 'Bank Transfer',
    },
    {
        invoice: 'INV007',
        paymentStatus: 'Unpaid',
        totalAmount: '$300.00',
        paymentMethod: 'Credit Card',
    },
];

type Structure = {
    HeadTitle: string;
    key: (string | number)[];
    type: 'str' | 'img' | 'video';
};
interface Props {
    structure: Structure[];
    data: any[];
    onAdd?: () => void;
    onEdit?: (id: number) => void;
    onDelete?: (id: number) => void;
}
export function TableDemo({ structure, data, onAdd, onEdit, onDelete }: Props) {
    const [role, setrole] = useState<'admin' | 'editor' | ''>('');

    useEffect(() => {
        const userstr = localStorage.getItem('adminUser');
        if (userstr) {
            const user = JSON.parse(userstr);
            const role = user.role;
            setrole(role);
        }
    }, []);
    return (
        <div className="p-10 max-sm:p-10 max-sm:overflow-scroll w-full min-w-[1000px]">
            <Table className=" min-w-[800px]">
                <TableCaption>A list of your recent invoices.</TableCaption>
                <TableHeader>
                    <TableRow className="gap-2">
                        {structure.map((item) => (
                            <TableHead className="text-start text-nowrap">
                                {item.HeadTitle}
                            </TableHead>
                        ))}
                        {/* <TableHead className="w-[100px]">Invoice</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Method</TableHead> */}
                        {onAdd && role === 'admin' && (
                            <TableHead className="text-right">
                                <Button onClick={onAdd}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        className="w-5 h-5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 4v16m8-8H4"
                                        />
                                    </svg>
                                    ADD
                                </Button>
                            </TableHead>
                        )}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((dataItem, i) => (
                        <TableRow key={i}>
                            {structure.map((StructureItem, i) => {
                                if (StructureItem.type === 'img') {
                                    return (
                                        <TableCell
                                            className="text-start"
                                            key={i}
                                        >
                                            <img
                                                src={
                                                    dataItem[
                                                        StructureItem.key[0]
                                                    ]
                                                }
                                                className="max-w-[70px]"
                                                alt=""
                                            />
                                        </TableCell>
                                    );
                                } else if (StructureItem.type === 'video') {
                                    return (
                                        <TableCell
                                            className="text-start"
                                            key={i}
                                        >
                                            <video
                                                src={
                                                    dataItem[
                                                        StructureItem.key[0]
                                                    ]
                                                }
                                                className="max-w-[70px]"
                                                controls={false}
                                                autoPlay
                                            />
                                        </TableCell>
                                    );
                                } else {
                                    if (StructureItem.key[1]) {
                                        if (StructureItem.key[2]) {
                                            return (
                                                <TableCell className="text-start">
                                                    {
                                                        dataItem[
                                                            StructureItem.key[0]
                                                        ][StructureItem.key[1]][
                                                            StructureItem.key[2]
                                                        ]
                                                    }
                                                </TableCell>
                                            );
                                        }
                                        return (
                                            <TableCell className="text-start">
                                                {
                                                    dataItem[
                                                        StructureItem.key[0]
                                                    ][StructureItem.key[1]]
                                                }
                                            </TableCell>
                                        );
                                    } else {
                                        return (
                                            <TableCell className="text-start">
                                                {dataItem[StructureItem.key[0]]}
                                            </TableCell>
                                        );
                                    }
                                }
                            })}
                            <TableCell className="text-right">
                                {onEdit && (
                                    // @ts-ignore: Ignore type checking for this line
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2"
                                        onClick={() => onEdit(dataItem._id)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                        Edit
                                    </Button>
                                )}{' '}
                                {onDelete && role === 'admin' && (
                                    // @ts-ignore: Ignore type checking for this line
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => onDelete(dataItem._id)}
                                    >
                                        {' '}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            x="0px"
                                            y="0px"
                                            width="100"
                                            height="100"
                                            viewBox="0,0,256,256"
                                        >
                                            <g
                                                fill="#ffffff"
                                                fill-rule="nonzero"
                                                stroke="none"
                                                stroke-width="1"
                                                stroke-linecap="butt"
                                                stroke-linejoin="miter"
                                                stroke-miterlimit="10"
                                                stroke-dasharray=""
                                                stroke-dashoffset="0"
                                                font-family="none"
                                                font-weight="none"
                                                font-size="none"
                                                text-anchor="none"
                                            >
                                                <g transform="scale(10.66667,10.66667)">
                                                    <path d="M10,2l-1,1h-4c-0.6,0 -1,0.4 -1,1c0,0.6 0.4,1 1,1h2h10h2c0.6,0 1,-0.4 1,-1c0,-0.6 -0.4,-1 -1,-1h-4l-1,-1zM5,7v13c0,1.1 0.9,2 2,2h10c1.1,0 2,-0.9 2,-2v-13zM9,9c0.6,0 1,0.4 1,1v9c0,0.6 -0.4,1 -1,1c-0.6,0 -1,-0.4 -1,-1v-9c0,-0.6 0.4,-1 1,-1zM15,9c0.6,0 1,0.4 1,1v9c0,0.6 -0.4,1 -1,1c-0.6,0 -1,-0.4 -1,-1v-9c0,-0.6 0.4,-1 1,-1z"></path>
                                                </g>
                                            </g>
                                        </svg>
                                        Delete
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                    {/* {invoices.map((invoice) => (
                    <TableRow key={invoice.invoice}>
                        <TableCell className="font-medium text-start">
                            {invoice.invoice}
                        </TableCell>
                        <TableCell className="text-start">
                            {invoice.paymentStatus}
                        </TableCell>

                        <TableCell className="text-right">
                            {invoice.totalAmount}
                        </TableCell>
                        <TableCell className="text-right">
                            <Button className="bg-blue-600 hover:bg-blue-700 ">
                                Edit
                            </Button>{' '}
                            <Button className="bg-red-600 hover:bg-red-700 ">
                                Delete
                            </Button>
                        </TableCell>
                    </TableRow>
                ))} */}
                </TableBody>
                {/* <TableFooter>
                <TableRow>
                    <TableCell colSpan={3}>Total</TableCell>
                    <TableCell className="text-right">$2,500.00</TableCell>
                </TableRow>
            </TableFooter> */}
            </Table>
        </div>
    );
}
