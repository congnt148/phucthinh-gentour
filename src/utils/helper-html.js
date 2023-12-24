const convertToTable = (time, html) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const liElements = doc.querySelectorAll('li');
  const liContents = Array.from(liElements).map((li) => li.innerHTML);

  // let titleNew = time
  // for(let i = 0; i < (24 -titleNew.length); i++) {
  //       titleNew+= `&nbsp;`
  // }
  const tableHtml = `
       <table style="border-collapse: collapse; border: none; width: 100%; margin-top: 30pt">
        <colgroup>
          <col style="width: 100pt;" >
            <p style="line-height: 150%; font-size: 16px; color: #404040; margin-top: 0pt; margin-bottom: 0pt; font-weight: bold;">${time}</p>
          </col> 
          <col>
            <p style="line-height: 150%; font-size: 16px; text-align: justify; color: #404040; margin-top: 0pt; margin-bottom: 0pt;">${liContents[0] || ''}</p>
          </col> 
        </colgroup>
        <tbody>
         <tr>
            <td style="vertical-align: text-top; mso-width-percent: 10%;">
              <p style="line-height: 150%; font-size: 16px; color: #404040; margin-top: 0pt; margin-bottom: 0pt; font-weight: bold;">
                ${time}
              </p>
            </td>
            <td style="width: 100%;">
              <p style="line-height: 150%; font-size: 16px; text-align: justify; color: #404040; margin-top: 0pt; margin-bottom: 0pt;">
                ${liContents[0] || ''}
              </p>
            </td>
         </tr>
        </tbody>
       </table>
      <ul class="colspan-2-td-ul">
          ${liContents
            .slice(1)
            .map((liContent) => `
              <li class="colspan-2-td-li">
                <p class="colspan-2-td-p">
                  ${liContent}
                </p>
              </li>`)
            .join('')
          }
      </ul>
    `;

  return tableHtml;
};

export { convertToTable };
