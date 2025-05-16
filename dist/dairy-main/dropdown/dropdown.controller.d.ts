import { DropdownService } from './dropdown.service';
export declare class DropdownController {
    private readonly dropdownService;
    constructor(dropdownService: DropdownService);
    billDateSP(data: any): Promise<any>;
    billDate(data: any): Promise<any>;
}
