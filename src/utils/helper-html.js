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
        <tbody>
         <tr>
           <td style="width: 43pt; vertical-align: text-top">
             <p
              style="line-height: 150%; font-size: 16px; color: #404040; margin-top: 0pt; margin-bottom: 0pt; font-weight: bold;">
                ${time}
              </p>
            </td>
            <td>
              <p style="line-height: 150%; font-size: 16px; text-align: justify; color: #404040; margin-top: 0pt; margin-bottom: 0pt;">
                ${liContents[0] || ''}
              </p>
            </td>
         </tr>
         
        </tbody>
      </table>
      <table style="border-collapse: collapse; border: none; width: 100%; margin-top: 30pt">
        <tbody>
          <tr style="padding-left: 10pt">
            <td colspan="2" class="colspan-2-td">
            <ul>
                  ${liContents
                    .slice(1)
                    .map((liContent) => `<li><p>${liContent}</p></li>`).join('')}
      </ul>
      </td>
      </tr>
        </tbody></table>
      
    `;

  return tableHtml;
};

export { convertToTable };
