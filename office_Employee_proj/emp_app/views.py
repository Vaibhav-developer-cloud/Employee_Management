from django.db.models import Q
from django.shortcuts import render,HttpResponse
from .models import Employee,Role,Department
from datetime import datetime
from django.shortcuts import redirect
# Create your views here.

def index(request):
    return render(request, 'index.html')


def all_emp(request):
    emps = Employee.objects.all()
    context = {
        "emps":emps
    }
    print(context)
    return render(request,'view_all_emp.html',context)

def add_emp(request):
    if request.method == "POST":
        f_name = request.POST.get("first_name")
        l_name = request.POST.get("last_name")
        department = request.POST.get("dept")
        salary = request.POST.get("sal")
        bonus = request.POST.get("bonus")
        role = request.POST.get("role")
        phone = request.POST.get("phone")
        #hire_date = request.POST.get('h_date')
        data = Employee(first_name=f_name,last_name=l_name,dept_id=department,salary=salary,bonus=bonus,role_id=role,phone=phone,hire_date=datetime.now())
        data.save()
        return redirect(all_emp)
        return HttpResponse("Data Successfully Save")
    else:
        print("Please Check")

    return render(request, 'add_emp.html')



def remove_emp(request, emp_id=0, cran=None):
    if emp_id:
        try:
            # SQL_DB_USER = cran.encrypt_value_using_aes("glLx9knHoGZ6Fc0gRI1uZw==")
            remove_emp_data = Employee.objects.get(id=emp_id)
            remove_emp_data.delete()
            # return HttpResponse("Successfully Removed")
            return redirect(all_emp)
        
        except:
            return HttpResponse("please Enter Correct id")
    emps = Employee.objects.all()

    context ={
        'emps':emps
    }
    return render(request, 'remove_emp.html',context)


def filter_emp(request):
    if request.method == 'POST':
        name = request.POST.get("first_name")
        dept = request.POST.get("dept")
        role = request.POST.get("role")
        emp = Employee.objects.all()
        if name:
            emps = emp.filter(Q(first_name__icontains=name) | Q(last_name__icontains=name))
        if dept:
            emps = emp.filter(dept__name=dept)
        if role:
            emps = emp.filter(role__name=role)
        context = {
            'emps': emps
        }
        return render(request,"view_all_emp.html",context)
    elif request.method == 'GET':
        return render(request, 'fikter_emp.html')
    else:
        return HttpResponse("Exception Occurred")
