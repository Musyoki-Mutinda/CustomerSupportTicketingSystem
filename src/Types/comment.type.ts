
export interface Comment {
  comment_date: Date;
  ticket_no: number;
  comment_text: string;
  customer_ID: number;
}

export interface NewComment{
  comment_date: Date;
  ticket_no: number;
  comment_text: string;
  customer_ID: number;
}


export interface updateComment{
  comment_date?: Date;
  ticket_no?: number;
  comment_text?: string;
  customer_ID?: number;
}