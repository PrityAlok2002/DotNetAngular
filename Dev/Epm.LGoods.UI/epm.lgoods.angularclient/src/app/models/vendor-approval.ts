export class VendorApproval {
  constructor(
    public vendorId: number,
    public vendorName: string,
    public vendorEmail: string,
    public businessName: string,
    public registrationDate: Date,
    public status: string
  ) { }

  get formattedRegistrationDate(): string {
    return this.registrationDate.toLocaleDateString();
  }

  isPending(): boolean {
    return this.status.toLowerCase() === 'pending';
  }

  isApproved(): boolean {
    return this.status.toLowerCase() === 'approved';
  }
}
