// import React from "react";

// import type { PaginatedResponse } from "../../../../Types";
// import type { IUser } from "../../Types";


// type TableProps = {
//   data: PaginatedResponse<IUser[]>;
//   onDelete: (data: IUser) => void;
//   onEdit: (data: IUser) => void;
//   // onPageChange: (page: number) => void;
//   // onRowsPerPageChange: (rows: number) => void;
// };

// const Users_Table: React.FC<TableProps> = ({
//   data,
//   onEdit,
//   onDelete,
//   // onPageChange,
//   // onRowsPerPageChange
// }) => {

//   return (
//     <div className="compTable">
//       <div className="headerTable">
//         <div className="row align-items-center">

//           <div className="col-2" />

//           <div className="col-7 columnHeaderTable">
//             <span>Nome</span>
//             <i className="icon-arrow-down"></i>
//           </div>

//           <div className="col-3 columnHeaderTable">
//             <span>Email</span>
//             <i className="icon-arrow-down"></i>
//           </div>
//         </div>
//       </div>

//       <div className="bodyTable">
//         <div className="listGroup">
//           {data.data.map((row, index) => (
//             <div className="row align-items-center" key={index}>

//               <div className="col-2 text-start">

//                 <button
//                   className="table-icon"
//                   onClick={() => onEdit(row)}
//                 >
//                   <i className="icon-pencil" />
//                 </button>

//                 <button
//                   className="ms-2 table-icon"
//                   onClick={() => onDelete(row)}
//                 >
//                   <i className="icon-bin" />
//                 </button>
//               </div>

//               <div className="col-7">
//                 <span>{row.first_name} {row.last_name}</span>
//               </div>

//               <div className="col-3">
//                 <span>{row.email}</span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Users_Table;

import React from "react";
import type { PaginatedResponse } from "../../../../Types";
import type { IUser } from "../../Types";
import Pagination from "../../../../Components/Pagination/Pagination";

type TableProps = {
  data: PaginatedResponse<IUser[]>;
  onDelete: (data: IUser) => void;
  onEdit: (data: IUser) => void;
  onPageChange: (page: number, perPage: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  currentPage: number;
  rowsPerPage: number;
};

const Users_Table: React.FC<TableProps> = ({
  data,
  onEdit,
  onDelete,
  onPageChange,
  onRowsPerPageChange,
  currentPage,
  rowsPerPage,
}) => {

  return (
    <div className="compTable">
      <div className="d-none d-md-block headerTable">
        <div className="row align-items-center">

          <div className="col-1" />

          <div className="col-1" />

          <div className="col-7 columnHeaderTable">
            <span>Nome</span>
            <i className="icon-arrow-down"></i>
          </div>

          <div className="col-3 columnHeaderTable">
            <span>Email</span>
            <i className="icon-arrow-down"></i>
          </div>
        </div>
      </div>

      {/* Corpo da tabela */}
      <div className="bodyTable">
        <div className="listGroup">
          {data.data.map((row, index) => (
            <div className="row align-items-center" key={index}>

              <div className="col-4 col-md-2 text-start">
                <button
                  className="table-icon"
                  onClick={() => onEdit(row)}
                >
                  <i className="icon-pencil" />
                </button>
                <button
                  className="ms-2 table-icon"
                  onClick={() => onDelete(row)}
                >
                  <i className="icon-bin" />
                </button>
              </div>

              <div className="col-2 col-md-1">
                <div className="avatar-container">
                  {row.avatar && row.avatar_mimmetype ? (
                    <img src={`data:${row.avatar_mimmetype};base64,${row.avatar}`} alt={row.first_name} />
                  ) : (
                    <i className="icon-user no-user-icon" />
                  )}
                </div>
              </div>

              <div className="col-6 col-md-6">
                <span>{row.first_name} {row.last_name}</span>
              </div>

              <div className="col-12 col-md-3 email-container">
                <span>{row.email}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Paginação */}
      <div className="mt-4 px-4">
        <Pagination
          currentPage={currentPage}
          totalPages={data.total_pages}
          onPageChange={onPageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={onRowsPerPageChange}
        />
      </div>
    </div>
  );
};

export default Users_Table;