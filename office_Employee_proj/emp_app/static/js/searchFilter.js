
    $(document).ready(function() {
        var table = $('#demo-datatables-5').DataTable();

        
        $('thead th').each(function() {
                // Create filter container HTML
                var filterContainer = `
                    <div class="filter-container">
                        <button type="button" class="btn btn-dark dropbtn" onclick="showFilterForm(this)"> 
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-filter" viewBox="0 0 16 16">
                                <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5.0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5"/>
                            </svg>
                        </button>
                        <div class="filter-form" style="display:none;">
                            <select class="form-select conditionSelect" aria-label="Default select example">
                                <option selected disabled>Condition</option>
                                <option value="contain">Contain</option>
                                <option value="=">Equal</option>
                                <option value=">">Greater Than</option>
                                <option value="<">Less Than</option>
                                <option value="between">Between</option>
                                <option value="starts">Start With</option>
                                <option value="ends">End With</option>
                            </select>
                            <input type="text" class="form-control mt-2 filterInput" placeholder="Value" style="display:none;">
                            <input type="text" class="form-control mt-2 filterInput1" placeholder="From" style="display:none;">
                            <input type="text" class="form-control mt-2 filterInput2" placeholder="To" style="display:none;">
                        </div>
                    </div>
                `;

            // Append filter container to current <th>
            $(this).append(filterContainer);
        });

        $(document).on('change', '.conditionSelect', function() {
            var selectedCondition = $(this).val();
            var filterForm = $(this).closest('.filter-form');
            if (selectedCondition === 'between') {
                filterForm.find('.filterInput').hide();
                filterForm.find('.filterInput1, .filterInput2').show();
            } else {
                filterForm.find('.filterInput').show();
                filterForm.find('.filterInput1, .filterInput2').hide();
            }
        });

        window.showFilterForm = function(button) {
            var filterForm = $(button).siblings('.filter-form');
            $('.filter-form').not(filterForm).hide(); // Hide any other open filter forms
            filterForm.toggle();
            event.stopPropagation();
        };

        $(document).on('input', '.filterInput, .filterInput1, .filterInput2', function() {
            var filterForm = $(this).closest('.filter-form');
            var condition = filterForm.find('.conditionSelect').val();
            var inputValue = filterForm.find('.filterInput').val().toLowerCase();
            var inputValue1 = filterForm.find('.filterInput1').val().toLowerCase();
            var inputValue2 = filterForm.find('.filterInput2').val().toLowerCase();

            $.fn.dataTable.ext.search.pop();

            if (condition) {
                $.fn.dataTable.ext.search.push(function(settings, data, dataIndex) {
                    var columnIndex = filterForm.closest('th').index();
                    var columnValue = (data[columnIndex] || '').toString().toLowerCase();

                    switch (condition) {
                        case 'contain':
                            return columnValue.indexOf(inputValue) !== -1;
                        case '=':
                            return columnValue == inputValue;
                        case '>':
                            return columnValue > inputValue;
                        case '<':
                            return columnValue < inputValue;
                        case 'between':
                            return columnValue >= inputValue1 && columnValue <= inputValue2;
                        case 'starts':
                            return columnValue.startsWith(inputValue);
                        case 'ends':
                            return columnValue.endsWith(inputValue);
                    }
                    return false;
                });
            }

            table.draw();
        });

        $(document).click(function(event) {
            if (!$(event.target).closest('.filter-container').length) {
                $('.filter-form').hide();
            }
        });
    });
