import React, { useState } from 'react';
import { CheckCircle2, ChevronRight, Edit3, User, Briefcase, Gamepad2, Palette, GraduationCap } from 'lucide-react';
import Button from '../shared/Button';
import Card from '../shared/Card';
import { useSetup } from '../../contexts/SetupContext';
import { PersonaType } from '../../types/personas';
import personasData from '../../data/personas.json';

const PersonaConfirmation: React.FC = () => {
  const { state, dispatch } = useSetup();
  const [isChangingPersona, setIsChangingPersona] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<PersonaType>(
    state.detectedPersona?.persona || 'Professional'
  );

  const getPersonaIcon = (persona: PersonaType) => {
    switch (persona) {
      case 'Gamer':
        return <Gamepad2 className="w-8 h-8" />;
      case 'Professional':
        return <Briefcase className="w-8 h-8" />;
      case 'Student':
        return <GraduationCap className="w-8 h-8" />;
      case 'Creator':
        return <Palette className="w-8 h-8" />;
      case 'Casual':
        return <User className="w-8 h-8" />;
    }
  };

  const getPersonaColor = (persona: PersonaType) => {
    switch (persona) {
      case 'Gamer':
        return 'from-purple-500 to-pink-500';
      case 'Professional':
        return 'from-blue-500 to-indigo-500';
      case 'Student':
        return 'from-green-500 to-teal-500';
      case 'Creator':
        return 'from-orange-500 to-red-500';
      case 'Casual':
        return 'from-gray-500 to-slate-500';
    }
  };

  const currentPersonaData = personasData.find(p => p.id === selectedPersona);

  const handleConfirm = () => {
    if (selectedPersona !== state.detectedPersona?.persona) {
      // Update persona if changed
      dispatch({
        type: 'SET_PERSONA',
        payload: {
          persona: selectedPersona,
          confidence: 100, // User manually selected
          isHybrid: false,
        },
      });
    }
    dispatch({ type: 'SET_PHASE', payload: 'app-recommendations' });
  };

  const handleChangePersona = () => {
    setIsChangingPersona(true);
  };

  const handleSelectPersona = (persona: PersonaType) => {
    setSelectedPersona(persona);
    setIsChangingPersona(false);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 flex overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="max-w-3xl w-full">
            {!isChangingPersona ? (
              // Confirmation View
              <div>
                {/* Header */}
                <div className="text-center mb-8">
                  <div
                    className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${getPersonaColor(
                      selectedPersona
                    )} rounded-3xl mb-6 shadow-lg`}
                  >
                    <div className="text-white">{getPersonaIcon(selectedPersona)}</div>
                  </div>

                  <h1 className="text-4xl font-bold text-gray-900 mb-3">
                    You're a {currentPersonaData?.name || selectedPersona}
                  </h1>
                  <p className="text-lg text-gray-600">
                    Based on our conversation, this profile best matches your needs
                  </p>
                </div>

                {/* Persona Details Card */}
                <Card variant="elevated" padding="lg" className="mb-8">
                  <div className="flex items-start gap-6">
                    <div
                      className={`flex-shrink-0 w-16 h-16 bg-gradient-to-br ${getPersonaColor(
                        selectedPersona
                      )} rounded-2xl flex items-center justify-center shadow-md`}
                    >
                      <div className="text-white">{getPersonaIcon(selectedPersona)}</div>
                    </div>

                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {currentPersonaData?.name}
                      </h2>
                      <p className="text-gray-600 mb-4">{currentPersonaData?.description}</p>

                      {/* Characteristics */}
                      <div className="space-y-3">
                        <div>
                          <h3 className="text-sm font-semibold text-gray-700 mb-2">
                            Key Characteristics:
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {currentPersonaData?.keywords.slice(0, 8).map((keyword, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>

                        {state.detectedPersona?.confidence !== undefined && !isNaN(state.detectedPersona.confidence) && (
                          <div className="pt-3 border-t border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">
                                Detection Confidence
                              </span>
                              <span className="text-sm font-bold text-primary-600">
                                {Math.round(state.detectedPersona.confidence)}%
                              </span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-primary-600 to-purple-600 transition-all duration-300"
                                style={{ width: `${Math.min(100, Math.max(0, state.detectedPersona.confidence))}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    onClick={handleChangePersona}
                    leftIcon={<Edit3 className="w-4 h-4" />}
                  >
                    This isn't quite right
                  </Button>

                  <Button
                    size="lg"
                    onClick={handleConfirm}
                    rightIcon={<ChevronRight className="w-5 h-5" />}
                  >
                    Looks good, continue
                  </Button>
                </div>
              </div>
            ) : (
              // Persona Selection View
              <div>
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-3">
                    Choose your profile type
                  </h1>
                  <p className="text-lg text-gray-600">
                    Select the profile that best matches how you'll use this PC
                  </p>
                </div>

                {/* Persona Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {personasData.map((persona) => {
                    const isSelected = selectedPersona === persona.id;
                    return (
                      <button
                        key={persona.id}
                        onClick={() => handleSelectPersona(persona.id as PersonaType)}
                        className={`relative p-6 rounded-2xl border-2 transition-all text-left ${
                          isSelected
                            ? 'border-primary-600 bg-primary-50 shadow-lg'
                            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                        }`}
                      >
                        {/* Selection Indicator */}
                        {isSelected && (
                          <div className="absolute top-4 right-4">
                            <CheckCircle2 className="w-6 h-6 text-primary-600" />
                          </div>
                        )}

                        <div className="flex items-start gap-4">
                          <div
                            className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br ${getPersonaColor(
                              persona.id as PersonaType
                            )} rounded-xl flex items-center justify-center shadow-md`}
                          >
                            <div className="text-white scale-75">
                              {getPersonaIcon(persona.id as PersonaType)}
                            </div>
                          </div>

                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">
                              {persona.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-3">{persona.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {persona.keywords.slice(0, 4).map((keyword, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                                >
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Actions */}
                <div className="flex justify-center">
                  <Button
                    size="lg"
                    onClick={handleConfirm}
                    rightIcon={<ChevronRight className="w-5 h-5" />}
                    disabled={!selectedPersona}
                  >
                    Continue with {selectedPersona}
                  </Button>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default PersonaConfirmation;
