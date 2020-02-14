

$(function () {

    function fancyboxInit() {

        $('.add_notes').fancybox({
            helpers: {
                overlay: {
                    closeClick: false
                }
            },
            afterShow: function (instance, current) {
                // console.log('Clicked element:');
                // console.log(current);
                popupSelectInit();
            }
        });


    }

    fancyboxInit();


    function validateUploadRemoveFiles() {
        let allRequests = {};

        //шаблон для добавления файлов после input file
        function popupFileTemplate(data) {
            let fileData = data;
            let source = document.getElementById("entry-template-popup").innerHTML;
            let template = Handlebars.compile(source);
            document.getElementById('popup-file-name-container').innerHTML += template(fileData);
        }

        //загрузка файла
        function getAjaxData(formData, currFile) {

            let currRequest;
            currRequest = $.ajax({
                type: 'POST',
                url: 'get_multiple_files.php',
                dataType: 'json',
                processData: false,
                contentType: false,
                data: formData,

                beforeSend: function () {

                    disabledPopupSubmit('add-note-btn', false);

                    let beforeSendObj = {
                        success: true,
                        file_name: currFile.name
                    };
                    // console.log(beforeSendObj);
                    popupFileTemplate(beforeSendObj);
                    // console.log(currFile.name);

                    $('[data-id = "' + currFile.name + '"]').find('.preloader-container').fadeIn(150);
                    removeUploadFile();

                },
                success: function (data) {
                    if (data) {
                        popupFileTemplate(data);
                        $('[data-id = "' + currFile.name + '"]').remove();
                        try {
                            let dataSuccess = data.success;
                            if (dataSuccess) {
                                console.log('успех');
                            }

                        } catch (e) {
                            alert();
                            console.log('Ошибка ' + e.name + ":" + e.message + "\n" + e.stack);
                            console.log('ошибочка');
                        }
                        removeUploadFile();
                    } else {
                        // alert('He удается загрузить файл' + currFile.name);
                        let dataSuccess = data.error;
                        console.log(data.error);
                    }
                },
                complete: function (data) {
                    // $('[data-id = '+ currFile.name +']').find('.preloader-container').hide();
                    disabledPopupSubmit('add-note-btn', true);


                }
            });
            allRequests[currFile.name] = currRequest;
            console.log(allRequests);
        }

        //отправка name удаленного файла
        function sentAjaxRemoveFile(removedElementName, removedElement) {
            console.log(removedElement);
            $.ajax({
                type: 'POST',
                url: 'get_multiple_files.php',
                dataType: 'json',
                processData: false,
                contentType: false,
                data: {fileName: removedElementName},

                beforeSend: function () {

                    $(removedElement).find('.preloader-container').fadeIn(150);

                },
                success: function (data) {
                    // console.log(data);
                    if (data) {

                        try {
                            var response = JSON.parse(data);
                            if (response.success) {
                                removeUploadFile();
                                // console.log('файл удален');
                            }

                        } catch (e) {
                            alert();
                            console.log('Ошибка ' + e.name + ":" + e.message + "\n" + e.stack);
                        }

                    } else {
                        alert('He удается удалить файл');
                    }
                },
                complete: function (data) {
                    $(removedElement).find('.preloader-container').hide();
                    // console.log('complete')

                }
            });
        }

        //заблокировать кнопку submit пока файлы не загружены
        function disabledPopupSubmit(btnId, isUpload) {

            let btnSubmit = document.getElementById(btnId);

            if (!isUpload) {

                btnSubmit.setAttribute('disabled', 'disabled');
            } else {
                btnSubmit.removeAttribute('disabled');
            }

        }

        // удаление загруженных файлов
        function removeUploadFile(removedElementName) {

            let removeBtn = document.getElementsByClassName('remove-selected-file');
            let uploadFileInp = document.getElementById('choose_file');
            let isUpload;
            let elementHtmlInp = document.getElementById('choose-file-container');
            for (let i = 0; i < removeBtn.length; i++) {

                removeBtn[i].addEventListener('click', function () {

                    let removedElement = this.closest('.input-file-item');
                    let removedElementName = removedElement.children[0].getAttribute('value');

                    elementHtmlInp.innerHTML = ' <label for="choose_file-1" class="choose-file-label">Выбрать файлы</label>' +
                        ' <input type="file" class="choose-file-input" id="choose_file-1" name="choose-file-1[]" multiple/>' +
                        ' <p class="popup-file-name"> Файл не выбран</p>';

                    if (!allRequests[removedElementName]) {
                        sentAjaxRemoveFile(removedElementName, removedElement);

                    } else {
                        allRequests[removedElementName].abort();
                        delete allRequests[removedElementName];

                    }
                    removedElement.remove();

                });
            }

        }

        //валидация выбранных файлов
        function validationInpFile(fileInput, validFileExtensions, maxFileSize) {

            let currentInputFileName = fileInput.name;
            let currFileSizeMB = (fileInput.size / 1024 / 1024).toFixed(4);
            let currentFileExt = currentInputFileName.substring(currentInputFileName.lastIndexOf('.') + 1);
            let fileExtIndexInValidExtArr = validFileExtensions.indexOf(currentFileExt.toLowerCase());
            let isFileValid;

            if (currFileSizeMB > maxFileSize) {

                alert('The maximum file size should not exceed 20 MB.\n' +
                    'Your file: ' + currentInputFileName + ' has size: ' + currFileSizeMB + ' MB');
                isFileValid = false;

            } else if (fileExtIndexInValidExtArr === -1) {
                alert('Sorry, your file: ' + currentInputFileName + ' is cannot be loaded.\n' +
                    'Valid file extensions are: ' + validFileExtensions.join(", "));
                isFileValid = false;
            } else {
                isFileValid = true;
            }

            return isFileValid;

        }

        //загрузка данных при изменении инпута type file
        function uploadFile(formId, arrValidFileExtensions, maxFileSize) {

            let validFileExtensions = arrValidFileExtensions,
                currFormId = document.getElementById(formId),
                maxCurrentFileSize = maxFileSize,
                inputFile = currFormId.querySelectorAll('input[type="file"]');

            // console.log(inputFile);

            for (let i = 0; i < inputFile.length; i++) {

                inputFile[i].addEventListener('change', function () {
                    // alert();
                    let currentFiles = inputFile[i].files;

                    let formData = new FormData();
                    for (let j = 0; j < currentFiles.length; j++) {

                        if (validationInpFile(currentFiles[j], validFileExtensions, maxCurrentFileSize)) {
                            formData.append("choose-file[]", this.files[j]);
                            getAjaxData(formData, currentFiles[j]);

                        } else {
                        }
                    }
                });

            }
        }

        uploadFile('popup-add-note', ["jpg", "jpeg", "png", "pdf", "doc", "docx", "xls", "xlsx", "txt", "json", "zip"], 20);

        //отследить удаление-добаление inputFile и запустить загрузку файлов
        function changeInp() {

            let elem = document.getElementById('choose-file-container');
            let observer = new MutationObserver(mutationRecords => {
                // console.log(mutationRecords); // console.log(изменения)
                uploadFile('popup-add-note', ["jpg", "jpeg", "png", "pdf", "doc", "docx", "xls", "xlsx", "txt", "json", "zip"], 20);
            });

            observer.observe(elem, {
                childList: true, // наблюдать за непосредственными детьми
                subtree: false, // и более глубокими потомками
                characterDataOldValue: true // передавать старое значение в колбэк
            });
        }

        changeInp();
    }

    validateUploadRemoveFiles();


    function addPropChecked() {
        $('.choose-file-input').change(function () {
            console.log($(this).val());
            if ($(this).val()) {
                $(this).prop('checked', true);
            } else {
                $(this).prop('checked', false);
            }
        });
        $('.b-filter__el-it-input').click(function () {
            if ($(this).attr('checked')) {
                console.log($(this).attr('checked'));
                $(this).prop('checked', true);
            } else {
                $(this).prop('checked', false);
            }
        })
    }

    // addPropChecked();

    function createListPopupInfo() {

        var form = document.getElementById('popup-add-note'),
            formData = {};
        // formParams = form.serializeArray();


        $.each(form.querySelectorAll('.choose-file-input'), function (i, tag) {
            // console.log(i);
            // console.log(tag.name);
            let tagName = tag.name;
            $.each($(tag)[0].files, function (i, file) {
                // console.log(file);
                // console.log(i);
                formData[tagName] = file;
            });
        });

        // $.each(formParams, function (i, val) {
        //     formData.append(val.name, val.value);
        // });

        console.log(formData);
        return formData;


    }


    $('#add-note-btn').click(function (e) {
        e.preventDefault();
        console.log('test')
        createListPopupInfo();
        console.log(createListPopupInfo());

        let popupList = $('#popup-add-note').serializeArray();
        console.log(popupList);

    });

    function popupSelectInit() {
        let select = $('.select-popup').select2({
            placeholder: " ",
            allowClear: true,
            closeOnSelect: false,
            width: '100%'
        });
        // $('.select').val(null).trigger('change');

    }

    function addStyleFocusInpFile() {
        $('#choose-file').focus(function () {
            $('label').addClass('focus');
        })
            .focusout(function () {
                $('label').removeClass('focus');
            });


    }

    addStyleFocusInpFile();

    //init select2 for filter block
    function initSelect2() {
        let select = $('.select').select2({
            placeholder: " ",
            allowClear: true,
            closeOnSelect: false,
            width: '100%'
        });
    }

    initSelect2();


    // добавить attr checked выбранным input
    function checkInp() {

        let label = $('.label');
        label.click(function (e) {

            let input = $(this).prev();
            // console.log(input);

            if (input.attr('checked') === undefined) {
                // console.log(input);
                input.attr('checked', "checked");
                // input.prop('checked', true);
                $(this).addClass('label-checked');

            } else {
                // console.log(input);
                input.removeAttr('checked');
                // input.prop('checked', false);
                $(this).removeClass('label-checked');
            }
        });
    }

    checkInp();

    function addPropCheckedInp() {

        let filterInput = $('.b-filter__el-it-input');

        filterInput.click(function () {

            if ($(this).attr('checked') === 'checked') {
                $(this).prop('checked', true);
            } else {
                $(this).prop('checked', false)
            }

            // console.log($(this).prop('checked'));
        })
    }

    addPropCheckedInp();


    //удалить attr checked вложенным инпутам блока "Страна", если радительский инпут не выбран
    // function checkInpChild() {
    //
    //     $('.b-filter__el-it-wrap--haschild .b-filter__el-it-input').click(function () {
    //
    //         if ($(this).attr('checked') !== "checked") {
    //             // console.log($(this).parents('.b-filter__el-it-wrap--haschild'));
    //             $(this).parents('.b-filter__el-it-wrap--haschild').find('input').removeAttr('checked');
    //             $(this).parents('.b-filter__el-it-wrap--haschild').find('.label').removeClass('label-checked');
    //
    //         }
    //
    //     });
    // }
    //
    // checkInpChild();


    function allAjax() {
        let countAllPages;
        let report_limit = 1;
        let report_offset = 0;
        let list = {};
        // console.log($("#report_form").serializeArray());

        //создать список выбранных элементов в фильтре и сделать пагинацию
        function CreateList() {

            $("#create_list").click(function (e) {
                e.preventDefault();
                console.log($("#filter-form").serializeArray());
            });

            // list = {};

            //очистка списка выбранных элементов
            function cleanList() {

                var cleanBtn = $('#reset');

                cleanBtn.click(function (e) {
                    e.preventDefault();
                    // list = {};

                    $('.select').val(null).trigger('change');

                    $('.b-filter__el-it-input[checked="checked"]').removeAttr('checked');

                    $('.radio-wrapper').find('label').removeClass('label-checked');

                    $('.radio-wrapper').find('.radio-input').removeAttr('checked');
                    $('.radio-wrapper').find('.radio-input').prop('checked', false);
                    $('.b-filter__el-it-wrap-child').slideUp(300);

                    // console.log(list);
                    // radio-input:checked
                });


            }

            cleanList();
            // $("#select__type-contract").on('select2:closing', function (e) {
            //     createList();
            // });
        }

        CreateList();

        function paginationBTn() {
            // console.log(countAllPages);
            let Pagination = {

                code: '',

                // --------------------
                // Utility
                // --------------------

                // converting initialize data
                Extend: function (data) {
                    data = data || {};
                    Pagination.size = data.size || 99;
                    Pagination.page = data.page || 1;
                    Pagination.step = data.step || 3;
                },

                // add pages by number (from [s] to [f])
                Add: function (s, f) {
                    for (var i = s; i < f; i++) {
                        Pagination.code += '<li class = "b-pagination__item"> ' + i + '</li >';
                    }
                },

                // add last page with separator
                Last: function () {
                    Pagination.code += '<i class="pagination-dots">...</i><li class = "b-pagination__item">' + Pagination.size + '</li >';
                },

                // add first page with separator
                First: function () {
                    Pagination.code += '<li class = "b-pagination__item">1</li ><i class="pagination-dots">...</i>';
                },

                // --------------------
                // Handlers
                // --------------------

                // change page
                Click: function () {
                    Pagination.page = +this.innerHTML;
                    report_offset = report_limit * Pagination.page;
                    // console.log(report_offset);
                    if (this.innerHTML == 1) {
                        document.getElementById('prev-btn').classList.add("disabled");
                    } else {
                        document.getElementById('prev-btn').classList.remove("disabled");
                    }
                    if (this.innerHTML >= Pagination.size) {

                        document.getElementById('next-btn').classList.add("disabled");
                    } else {

                        document.getElementById('next-btn').classList.remove("disabled");
                    }

                    Pagination.Start();
                    showAjaxElementForPaginationClick();
                },

                // previous page
                Prev: function () {
                    Pagination.page--;
                    report_offset = report_limit * Pagination.page;
                    // console.log(report_offset);
                    if (Pagination.page < 1) {
                        Pagination.page = 1;
                    }
                    if (Pagination.page == 1) {
                        document.getElementById('prev-btn').classList.add("disabled");
                    } else {
                        document.getElementById('prev-btn').classList.remove("disabled");
                    }
                    document.getElementById('next-btn').classList.remove("disabled");
                    Pagination.Start();
                    showAjaxElementForPaginationClick();
                },

                // next page
                Next: function () {
                    Pagination.page++;
                    report_offset = report_limit * Pagination.page;
                    // console.log(report_offset);
                    if (Pagination.page > Pagination.size) {
                        Pagination.page = Pagination.size;

                    }
                    if (Pagination.page == Pagination.size) {
                        document.getElementById('next-btn').classList.add("disabled");
                    } else {
                        document.getElementById('next-btn').classList.remove("disabled");
                    }
                    document.getElementById('prev-btn').classList.remove("disabled");
                    Pagination.Start();
                    showAjaxElementForPaginationClick();
                },


                // --------------------
                // Script
                // --------------------

                // binding pages
                Bind: function () {
                    let a = Pagination.e.getElementsByClassName('b-pagination__item');
                    for (var i = 0; i < a.length; i++) {
                        if (+a[i].innerHTML === Pagination.page) a[i].className += ' b-pagination__item--active disabled';

                        a[i].addEventListener('click', Pagination.Click, false);
                    }
                },

                // write pagination
                Finish: function () {
                    Pagination.e.innerHTML = Pagination.code;
                    Pagination.code = '';
                    Pagination.Bind();
                },

                // find pagination type
                Start: function () {

                    if (Pagination.size < Pagination.step * 2 + 6) {
                        Pagination.Add(1, Pagination.size + 1);
                    } else if (Pagination.page < Pagination.step * 2 + 1) {
                        Pagination.Add(1, Pagination.step * 2 + 4);
                        Pagination.Last();
                    } else if (Pagination.page > Pagination.size - Pagination.step * 2) {
                        Pagination.First();
                        Pagination.Add(Pagination.size - Pagination.step * 2 - 2, Pagination.size + 1);
                    } else {
                        Pagination.First();
                        Pagination.Add(Pagination.page - Pagination.step, Pagination.page + Pagination.step + 1);
                        Pagination.Last();
                    }
                    Pagination.Finish();
                },


                // --------------------
                // Initialization
                // --------------------

                // binding buttons
                Buttons: function (e) {
                    let nav = e.getElementsByClassName('b-pagination__item');
                    nav[0].addEventListener('click', Pagination.Prev, false);
                    nav[1].addEventListener('click', Pagination.Next, false);
                },

                // create skeleton
                Create: function (e) {

                    let html = [
                        '<button class="b-pagination__item disabled" id="prev-btn">Назад</button>', // previous button
                        '<span class="pagination-container"></span>',  // pagination container
                        '<button class="b-pagination__item" id="next-btn">Далее</button>'  // next button
                    ];

                    e.innerHTML = html.join('');
                    Pagination.e = e.getElementsByClassName('pagination-container')[0];
                    Pagination.Buttons(e);
                },

                // init
                Init: function (e, data) {
                    Pagination.Extend(data);
                    Pagination.Create(e);
                    Pagination.Start();
                }
            };


            // Initialization

            let init = function () {

                Pagination.Init(document.getElementById('pagination'), {

                    size: countAllPages / report_limit, // pages size
                    page: 1,  // selected page
                    step: 1   // pages before and after current
                });
            };

            document.addEventListener('DOMContentLoaded', init(), false);


        }

        // paginationBTn();

        //вызывается когда запрос успешный, формирует таблицы с данными
        function addAjaxSuccess(data) {


            $.each(data, function (i, el) {


            });
        }


        function showAjaxElementForCreateList() {
            // console.log(report_limit);
            // console.log(report_offset);
            // console.log(list);

            $.ajax({
                type: 'GET',
                url: 'mock.json',
                dataType: 'json',
                // data: {
                //     "report_limit": report_limit,
                //     "report_offset": report_offset,
                //     "report_list": list,
                //
                // },

                beforeSend: function () {
                    $('.tables-wrap').find('.preloader-container').fadeIn(150);
                    // console.log('before sent');

                },
                success: function (data) {
                    // console.log(data);
                    if (data) {
                        // console.log(data);
                        countAllPages = data.length;
                        paginationBTn();

                        // divTableWrapper.delete();
                        console.log($('.table-responsive.main-table-header').next());
                        // $('.table-responsive.main-table-header').next().remove();
                        // addAjaxSuccess(data);

                    } else {

                        console.log('Нет данных для загрузки!');
                        // $('.btn-showmore').remove();
                    }
                },
                complete: function (data) {
                    $('.tables-wrap').find('.preloader-container').hide();

                }
            });


            return false;


        }

        //отправлять ajax при клике на пагинации страницы
        function showAjaxElementForPaginationClick() {

            // console.log(report_limit);
            console.log(report_offset);
            // console.log(list);

            $.ajax({
                type: 'GET',
                url: 'mock.json',
                dataType: 'json',
                // data: {
                //     "report_limit": report_limit,
                //     "report_offset": report_offset,
                //
                // },

                beforeSend: function () {
                    $('.tables-wrap').find('.preloader-container').fadeIn(150);
                    // console.log('before sent');

                },
                success: function (data) {
                    // console.log(data);
                    if (data) {
                        console.log(data);
                        text = "";
                        addAjaxSuccess(data);

                    } else {

                        console.log('Нет данных для загрузки!');
                        // $('.btn-showmore').remove();
                    }
                },
                complete: function (data) {
                    $('.tables-wrap').find('.preloader-container').hide();

                }
            });


            return false;
        }

        //отправлять ajax при вваде в поле "поиск"
        function searchClients() {
            let searchInpVal;
            $('.b-search__input').on('input', function () {

                if ($(this).val().length >= 3) {
                    searchInpVal = $(this).val();
                } else {
                    return
                }
                console.log(searchInpVal);


                $.ajax({
                    type: 'GET',
                    url: 'mock.json',
                    dataType: 'json',
                    data: {
                        "my_client_search": searchInpVal
                    },

                    beforeSend: function () {
                        $('.tables-wrap').find('.preloader-container').fadeIn(150);

                    },
                    success: function (data) {
                        console.log(data);

                        if (data) {
                            // console.log(data);
                            countAllPages = data.length;
                            paginationBTn();
                            text = "";
                            addAjaxSuccess(data);

                        } else {

                            // console.log('Нет данных для загрузки!');
                            // $('.btn-showmore').remove();
                        }
                    },
                    complete: function (data) {
                        $('.tables-wrap').find('.preloader-container').hide();

                    }
                });
            });
        }

        searchClients();

    }

    allAjax();

    //показывать скрытые input, если родительские выбраны
    // function showFilterElChild() {
    //
    //     var inputWrap = $('.b-filter__el-it-wrap'),
    //         input = $('.b-filter__el-it-input');
    //
    //     input.on('click', function () {
    //         if ($(this).parents(inputWrap).hasClass('b-filter__el-it-wrap--haschild') &&
    //             $(this).prop('checked') === true) {
    //
    //             $(this).parent().find('.b-filter__el-it-wrap-child').slideToggle(300);
    //         } else if ($(this).parents(inputWrap).hasClass('b-filter__el-it-wrap--haschild') &&
    //             $(this).prop('checked') === false) {
    //             $(this).parent().find('.b-filter__el-it-wrap-child').slideToggle(300);
    //         }
    //     });
    // }
    //
    // showFilterElChild();

    //показывать или скрывать сонтент сразу во всех таблицах
    function toggleAllTableContent() {


        $('.main-toggle-btn').click(function () {

            let tableInnerWrapOpenEl = $('.table-inner-wrapper.open-el');
            let tableInnerWrapCloseEl = $('.table-inner-wrapper.close-el');


            if (!$(this).hasClass('main-toggle-btn--close')) {

                tableInnerWrapOpenEl.slideUp(300);

                tableInnerWrapOpenEl.addClass("close-el");
                tableInnerWrapOpenEl.removeClass("open-el");


                $('.open-table').addClass('close-inner-table');
                $('.table-inner-itm-wrapper').css('paddingBottom', '0px');
                $('.header-main-item').css('borderBottom', 'none');

                $(this).addClass('main-toggle-btn--close');


            } else {


                $(this).removeClass('main-toggle-btn--close');

                tableInnerWrapCloseEl.slideDown(300);

                tableInnerWrapCloseEl.addClass("open-el");
                tableInnerWrapCloseEl.removeClass("close-el");
                $('.table-inner-itm-wrapper').css('paddingBottom', '24px');
                $('.header-main-item').css('borderBottom', '1px solid #CED4DA');
                $('.open-table').removeClass('close-inner-table');
            }
        })
    }

    toggleAllTableContent();


    //показывать или скрывать сонтент в одной таблице
    function toggleInnerTable() {

        $('.open-table').click(function (e) {

            let tableInnerWrapper = $('.table-inner-wrapper');

            if (!$(this).hasClass('close-inner-table')) {
                $(this).parents('.table-inner-itm').find('.table-inner-wrapper').slideUp(300);
                $(this).addClass('close-inner-table');
                $(this).parents('.table-inner-itm-wrapper').css('paddingBottom', '0');
                $(this).parents('.header-main-item').css('borderBottom', 'none');

            } else {
                $(this).parents('.table-inner-itm').find('.table-inner-wrapper').slideDown(300);
                $(this).removeClass('close-inner-table');
                $(this).parents('.table-inner-itm-wrapper').css('paddingBottom', '24px');
                $(this).parents('.header-main-item').css('borderBottom', '1px solid #CED4DA');
            }

        });
    }

    toggleInnerTable();


    //стили для поиска в select c select2
    function addStyleSearchSelect() {


        $('.select').on('change', function () {

            if ($(this).next().find($('.select2-selection__choice')).length !== 0) {
                $(this).next().find($('.select2-container .select2-search--inline')).addClass('search-style');
            } else {

                $(this).next().find($('.select2-container .select2-search--inline')).removeClass('search-style');
            }

        });

    }

    addStyleSearchSelect();

});


function closeHeaderDropdownOverlayClick() {
    $('.wrapper').click(function () {
        let dropdownUser = $('.b-dropdown-user');
        let dropdown = $('.b-dropdown');
        $('.header-left-part-item').removeClass('shadow-block');
        dropdownUser.slideUp();
        dropdownUser.removeClass('b-dropdown-active');

        dropdown.slideUp();
        dropdown.removeClass('b-dropdown-active');
        $('.b-dropdown-wrapper-user').removeClass('shadow-block');
    })

}

closeHeaderDropdownOverlayClick();

//показать/скрыть контент в блоке "Фильтры" и "Клиенты"
function slideContent() {
    $('.b-filter-caption').click(function () {

        $(this).toggleClass('b-filter-caption--active');

        if ($(this).hasClass('close-block')) {
            $(this).next().slideDown();
            $(this).removeClass('close-block');
        } else {
            $(this).next().slideUp();
            $(this).addClass('close-block');
        }
    })
}

slideContent();

//сортировка строк в таблице в алфавитном порядке или по возрастанию/убыванию
function tableInnerSort() {

    $('.table-inner-header').find('.toggle-btn').click(function () {

            let thisButtonParentIndex = $(this).parents('th').index();
            let tables = $(this).closest('table');

            let sortedRows = [];
            let arrTr = [];

            $.each(tables, function (i, val) {
                sortedRows.push(val.rows);
            });


            for (let i = 0; i < sortedRows[0].length; i++) {

                if (i >= 2) {
                    arrTr.push(sortedRows[0][i])
                }
            }


            if ($(this).hasClass('buttonSortToggle')) {

                arrTr.sort(function (rowA, rowB) {
                    let result;
                    if (isFinite(parseInt(rowA.cells[thisButtonParentIndex].innerHTML[0]))) {
                        result = (+(parseInt($.trim(rowA.cells[thisButtonParentIndex].innerHTML)))) <
                        (+(parseInt($.trim(rowB.cells[thisButtonParentIndex].innerHTML)))) ?
                            1 :
                            -1;


                    } else {
                        result = $.trim(rowA.cells[thisButtonParentIndex].innerHTML) <
                        $.trim(rowB.cells[thisButtonParentIndex].innerHTML) ?
                            1 :
                            -1;

                    }
                    return result;

                });

                tables[0].tBodies[0].append(...arrTr);

                $(this).removeClass('buttonSortToggle');
                $(this).removeClass('toggle-btn-down');

            } else {

                $(this).addClass('buttonSortToggle');
                $(this).addClass('toggle-btn-down');

                arrTr.sort(function (rowA, rowB) {
                    let result;

                    if (isFinite(parseInt(rowA.cells[thisButtonParentIndex].innerHTML[0]))) {

                        result = (+(parseInt($.trim(rowA.cells[thisButtonParentIndex].innerHTML)))) >
                        (+(parseInt($.trim(rowB.cells[thisButtonParentIndex].innerHTML)))) ?
                            1 :
                            -1;
                    } else {
                        result = $.trim(rowA.cells[thisButtonParentIndex].innerHTML) >
                        $.trim(rowB.cells[thisButtonParentIndex].innerHTML) ?
                            1 :
                            -1;
                    }

                    return result;
                });


                tables[0].tBodies[0].append(...arrTr);

            }


        }
    )

}

tableInnerSort();


//сортировка таблиц с данными в алфавитном порядке или по возрастанию/убыванию


function sortMainTable() {

    $('.table-main__first-item').find('.toggle-btn').click(function () {

        let thisButtonParentIndex = $(this).closest('td').index();
        // console.log(thisButtonParentIndex);

        let innerTableHeads = $('.main-table-header').find('.header-main-item');
        let arr = [];

        // console.log(innerTableHeads);

        for (let i = 0; i < innerTableHeads.length; i++) {
            arr.push(innerTableHeads[i])
        }
//
        if ($(this).hasClass('buttonSortToggle')) {

            arr.sort(function (rowA, rowB) {
                let result;
                if (isFinite(parseInt($.trim(rowA.cells[thisButtonParentIndex].innerHTML)))) {
                    result = (+(parseInt($.trim(rowA.cells[thisButtonParentIndex].innerHTML), 10))) <
                    (+(parseInt($.trim(rowB.cells[thisButtonParentIndex].innerHTML), 10))) ?
                        1 :
                        -1;

                } else {
                    result = $.trim(rowA.cells[thisButtonParentIndex].innerHTML) <
                    $.trim(rowB.cells[thisButtonParentIndex].innerHTML) ?
                        1 :
                        -1;


                }
                return result;

            });
            $(this).removeClass('toggle-btn-down');
            $(this).removeClass('buttonSortToggle')
        } else {
            arr.sort(function (rowA, rowB) {
                let result;
                if (isFinite(parseInt($.trim(rowA.cells[thisButtonParentIndex].innerHTML)))) {
                    result = (+(parseInt($.trim(rowA.cells[thisButtonParentIndex].innerHTML), 10))) >

                    (+(parseInt($.trim(rowB.cells[thisButtonParentIndex].innerHTML), 10))) ?
                        1 :
                        -1;

                } else {
                    result = $.trim(rowA.cells[thisButtonParentIndex].innerHTML) >
                    $.trim(rowB.cells[thisButtonParentIndex].innerHTML) ?
                        1 :
                        -1;

                }
                return result;
            });
            $(this).addClass('buttonSortToggle');
            $(this).addClass('toggle-btn-down');
        }


        $.each(arr, function (i, val) {
            // console.log(val);
            $('.table-child-wrapp').append($(val).parents('.table-inner-itm-wrapper'));
        })


    });
}

sortMainTable();


