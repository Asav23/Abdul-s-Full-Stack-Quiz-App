from django.shortcuts import render, redirect, get_object_or_404
from .models import Quiz, Question, Answer
from django.http import JsonResponse

# List of all quizzes
def quiz_list_view(request):
    quizzes = Quiz.objects.all().order_by('-created_at')
    return render(request, 'kayquiz/quiz_list.html', {'quizzes': quizzes})

# Create a new quiz
def quiz_create_view(request):
    if request.method == 'POST':
        quiz_name = request.POST.get('quiz_name')
        questions = request.POST.getlist('questions')
        answers = request.POST.getlist('answers')
        quiz = Quiz.objects.create(name=quiz_name)

        for i, question_text in enumerate(questions):
            question = Question.objects.create(quiz=quiz, text=question_text)
            Answer.objects.create(question=question, text=answers[i], is_correct=True)
        
        return redirect('quiz_list')

    return render(request, 'kayquiz/quiz_create.html')

# Take a quiz
def quiz_test_view(request, quiz_id):
    quiz = get_object_or_404(Quiz, id=quiz_id)
    return render(request, 'kayquiz/quiz_test.html', {'quiz': quiz})

# Submit results after quiz test
def quiz_results_view(request, quiz_id):
    quiz = get_object_or_404(Quiz, id=quiz_id)
    user_answers = request.POST.getlist('answers')

    correct_answers_count = 0
    incorrect_questions = []

    for question in quiz.questions.all():
        correct_answer = question.answers.filter(is_correct=True).first()
        user_answer = user_answers.pop(0)

        if correct_answer.text == user_answer:
            correct_answers_count += 1
        else:
            incorrect_questions.append({
                'question': question.text,
                'user_answer': user_answer,
                'correct_answer': correct_answer.text
            })

    return render(request, 'kayquiz/quiz_results.html', {
        'quiz': quiz,
        'correct_answers_count': correct_answers_count,
        'total_questions': quiz.questions.count(),
        'incorrect_questions': incorrect_questions,
    })

# API view for deleting quizzes
def delete_quiz_view(request, quiz_id):
    quiz = get_object_or_404(Quiz, id=quiz_id)
    quiz.delete()
    return JsonResponse({'status': 'deleted'})
