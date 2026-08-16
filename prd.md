# OVerjob Technical Center

## General

Overjob Technical Center is a nextjs application used for request transfer job to technical center.

## Stack
The main stack is :

- NextJS 16
- Prisma ORM with postgresql driver
- shadcn UI with baseUI

## Database Design
1. Users Table
    - ID, integer, autoincrement, primary Key
    - Name, varchar, max 50, not nullable
    - Email, varchar, max 75, unique, not null.
    - Password, varchar, max 150, encrypted string, not null.

2. Categories Table
    - id, integer, autoincrement, primary key.
    - name, varchar, 50, not null, unique.
    - description, varchar 200, nullable.

3. Jobs Table.
    - ID, biginteger, autoincrement, primary key. 
    - Category, integer, constraint to Categories.id, on delete restricted.
    - Notification, varchar 50, not null, unique,
    - Model, varchar 50, null,
    - SerialNumber, Varchar 75, null,
    - Symptom, varchar 100, not null,
    - Actions, text, not null,
    - ChangedParts, varchar 255, null,
    - Sender, varchar, Not Null,
    - RequestBy, Varchar, Not Null
    - RequestOn, Datetime, Not Null,
    - ApprovedBy, integer, constraint to User.ID, null,
    - ApprovedOn, Datetime, null,
    - ReceivedOn, Datetime, Null,
    - ReceivedBy, integer, constraint to User.ID, null,
    - HandledBy, integer, contraint to User.ID, null,
    - HandledOn, Datetime, null,
    - ActionTakenByTC, text, null,
    - Result, Emum (OK, FAILED), null
    - SendBackOn, datetime, null,
    - SendBackBy, integer, contrained to User.ID, null
    - AWBNumber, varchar 50, null,
    - CompletedOn, datetime Null,
    - CompletedBy, integer, contrained to User.ID null

# Pages

The pages on this project is devided into two groups:

1. Public Page
2. Protected Page

### Public Page

Public page consist of:

1. Main page. This page displays list of paginated **active** overjobs currently handle by Technical Center. The data source is Jobs Table. 
The lists must contain:

    - Job Number. Linked to Job Detail
    - Category.Name
    - Notification, 
    - Model, 
    - Serial Number,
    - Symptom
    - Sender,
    - HandledBy,

Paginated is 10 record per page.

2. Job Details, This page is display all items in the jobs table. Tabled display. The route must be /detail/:id

3. Job Request, This is form linked to Job Table. The route is /request. The field is:

    - Category, drop down, with option from Categories Table, labeled as Kategori.
    - Notification, labeles as No LR, plavelhoder is: Nomer Laporan Reparasi
    - Model. labeled as "Model Unit". Placeholder is "Model"
    - Serial Number, labelled as "Nomer Seri". placeholder, "SN"
    - Symptom, Labeled as Deskripsi, placeholder is: "Tuliskan detail keluhan / kerusakan". Shown as text area.
    - Actions, labeled as "Tindakan", placeholder is "Tuliskan tindakan apa yang sudah dilakukan", shown as txt area
    - ChangedParts, labeled as "Part yang di ganti", placeholder: "Part apa saja yang sudah di ganti (JIka ada)", shown as text area.
    - Sender, labeled as "Cabang/SDSS/SSR/SASS", palceholder: "Nama Cabang, SDSS, SSR, atau SASS"
    - RequestBy,labeled as "Nama", placeholder: "Nama Anda".
    - Button Submit with caption "Kirim Request", confirm "Kirim Request ke TC?", if yes, then save form.

4. Login Page, route is /admin/login. Login use email and password. 

### Protected Page

Every acces to /admin/ must be authenticated user. Protected page consist of:

1. List all jobs, route /admin/.

    Required column:
    - Job Number. Linked to Job Detail
    - Category.Name
    - Notification,
    - Model,
    - Serial Number,
    - Symptom
    - Sender,
    - Action. On action columns, has a Edit button link to /admin/edit/:id, and Reset button link to /admin/reset/:id.

    On the top of table, use a filter:
   - StatusL: Complited, Active (Default). Set filter field: CompletedOn. Active is Null.
    - Search Field with button. On Submit, open page /admin/seacrh?q=value
    - Save in Excel, reutrn excel file all active request (not paginated), include all table columns.
   
2. Edit Job Request, route /admin/edit/:id

   Title page: Edit Request Data.

    load the record and build a form for edit All Record:
    - ID, Just Display the record, readonly
    - Category, Input field, Readonly
    - Notification, Input field, Readonly
    - Model, input field, Read only
    - SerialNumber, Input field, readonly
    - Symptom, Input field, readonly
    - Actions, Text Area field, readonly
    - ChangedParts, Text Area field, readonly
    - Sender, Input field, readonly
    - RequestBy, Input field, readonly
    - RequestOn, Input field, readonly

    Buttons:
    - Approve. Enable if ApprovedOn is empty,  This button will update field: 
      - ApprovedBy : Current logged user id.
      - ApprovedOn : Current Date Time.
    - Received. Enable if ReceivedOn is empty AND ApprovedON is NOT EMPTY,  This button will update field:
       - ReceivedBy : Current logged user id.
       - ReceivedOn : Current Date Time.
    - Handle. Enable if HandledBy is Empty AND ReceivedOn AND ApprovedOn is NOT EMPTY, 
      This button will open Modal dialog with input field:
      - HandledBy: SelectOption Users, with user name as Option, and ID as Value.
      - handledOn : Datetime Select
      - Result : Radio: OK and Failed. Can unselect both.
      - ActionTakenByTC: Text Area, with label: Perbaikan yang dilakukan.
      - Save and Cancel Button. On Save, update the appropiated field.
    - Send Back, Enable if SendBackOn is EMPTY AND ApprovedOn, ReceivedOn and HandledOn is NOT EMPTY. On Click, open Modal dialog
      with field:
      - AWB Number : Input Field,
      - Send back on: Date picker
      - Send By: Dropdown user name with value user ID.
    - Set Completed, enable if CompletedOn is empty, and SendBackOn,  ApprovedOn, ReceivedOn and HandledOn is NOT EMPTY.
      This button will update CompletedBy with curent logged user id, and completed on with currentn date time. 

3. Reset Job Request, route /admin/reset/:id

    Title page: Reset Request Data.
  
   Load the record and build a form for reset All Record:
    - ID, Just Display the record, readonly
    - Category, Input field, Readonly
    - Notification, Input field, Readonly
    - Model, input field, Read only
    - SerialNumber, Input field, readonly
    - Symptom, Input field, readonly
    - Actions, Text Area field, readonly
    - ChangedParts, Text Area field, readonly
    - Sender, Input field, readonly
    - RequestBy, Input field, readonly
    - RequestOn, Input field, readonly

   Buttons (All is warning button type). All Button give Confirmation: This Action will reset selected Records, and CANNOT be UNDO!. Are you Sure?:
    - Reset Approve.  This button will update field:
        - ApprovedBy : null.
        - ApprovedOn : Null.
    - Reset Received. This button will update field:
        - ReceivedBY : Null
        - ReceivedOn : Null
    - Reset Handle. This button will update field:
        - HandledBy: Null
        - handledOn : Null
        - Result : Null.
        - ActionTakenByTC: Null
    - Reset Send Back, This button will update field:
        - AWB Number : NUll,
        - Send back on: Null
        - Send By: NUll
    - Set Completed, This button will update field: 
      - CompletedBy : Null
      - CompletedOn: Null.

4. Search Result page, 
    query Param: q as string. Find data on Jobs Table from row: Notification or Model LIKE the query param.
    The page result display:
    - Job Number. Linked to Job Detail
    - Category.Name
    - Notification,
    - Model,
    - Serial Number,
    - Symptom
    - Sender,
    - Action. On action columns, has a Edit button link to /admin/edit/:id, and Reset button link to /admin/reset/:id.

Paginated, wil 10 record on every page.